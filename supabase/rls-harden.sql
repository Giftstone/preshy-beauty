-- Run AFTER schema.sql if you already applied the old open-write policies.
-- Removes public write access to catalog tables.

do $$
declare r record;
begin
  for r in (
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('products','services','stylists','extensions','bookings','orders')
  ) loop
    execute format('drop policy if exists %I on %I', r.policyname, r.tablename);
  end loop;
end $$;

create policy "public_read_products" on products for select using (true);
create policy "public_read_services" on services for select using (true);
create policy "public_read_stylists" on stylists for select using (true);
create policy "public_read_extensions" on extensions for select using (true);

create policy "public_insert_bookings" on bookings for insert with check (true);
create policy "public_insert_orders" on orders for insert with check (true);
create policy "public_read_bookings" on bookings for select using (true);
create policy "public_read_orders" on orders for select using (true);

-- Catalog writes only via service role (bypasses RLS)
