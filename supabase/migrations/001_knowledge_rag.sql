-- Avril Systems Knowledge RAG (pgvector)
create extension if not exists vector;

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_path text not null unique,
  namespace text not null,
  language text not null default 'en',
  metadata jsonb not null default '{}'::jsonb,
  content_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  content text not null,
  embedding vector(1024),
  chunk_index int not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_knowledge_documents_namespace
  on public.knowledge_documents(namespace);

create index if not exists idx_knowledge_chunks_document_id
  on public.knowledge_chunks(document_id);

create index if not exists idx_knowledge_chunks_embedding
  on public.knowledge_chunks
  using hnsw (embedding vector_cosine_ops);

create or replace function public.match_knowledge_chunks(
  query_embedding vector(1024),
  match_count int default 5,
  filter_namespace text default null
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  namespace text,
  source_path text,
  title text,
  similarity float
)
language sql stable
as $$
  select
    c.id,
    c.document_id,
    c.content,
    d.namespace,
    d.source_path,
    d.title,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks c
  join public.knowledge_documents d on d.id = c.document_id
  where c.embedding is not null
    and (filter_namespace is null or d.namespace = filter_namespace)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

comment on table public.knowledge_documents is 'Avril Systems RAG source documents';
comment on table public.knowledge_chunks is 'Avril Systems RAG embedded chunks';

alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'knowledge_documents' and policyname = 'knowledge_documents_anon_select'
  ) then
    create policy knowledge_documents_anon_select
      on public.knowledge_documents for select to anon, authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where tablename = 'knowledge_chunks' and policyname = 'knowledge_chunks_anon_select'
  ) then
    create policy knowledge_chunks_anon_select
      on public.knowledge_chunks for select to anon, authenticated using (true);
  end if;
end $$;

grant usage on schema public to anon, authenticated;
grant select on public.knowledge_documents to anon, authenticated;
grant select on public.knowledge_chunks to anon, authenticated;
grant execute on function public.match_knowledge_chunks(vector, int, text) to anon, authenticated;
