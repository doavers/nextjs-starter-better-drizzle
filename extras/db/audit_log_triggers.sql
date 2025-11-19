/* Audit log: create function and trigger for invoices table */
CREATE OR REPLACE FUNCTION audit_log_invoices()
RETURNS trigger AS $$
DECLARE
  v_user_id text;
BEGIN
  -- Try to read a session config variable that can be set by the application
  BEGIN
    v_user_id := current_setting('audit.user_id', true);
  EXCEPTION WHEN OTHERS THEN
    v_user_id := NULL;
  END;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs(table_name, operation, changed_at, user_id, changed_data)
    VALUES ('invoices', 'INSERT', NOW(), v_user_id, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs(table_name, operation, changed_at, user_id, changed_data)
    VALUES ('invoices', 'UPDATE', NOW(), v_user_id, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs(table_name, operation, changed_at, user_id, changed_data)
    VALUES ('invoices', 'DELETE', NOW(), v_user_id, row_to_json(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'invoices_audit_log_trg') THEN
    CREATE TRIGGER invoices_audit_log_trg
    AFTER INSERT OR UPDATE OR DELETE ON invoices
    FOR EACH ROW EXECUTE FUNCTION audit_log_invoices();
  END IF;
END
$$;