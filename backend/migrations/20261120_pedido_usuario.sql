-- Compatible: conserva pedidos históricos con usuario_id NULL.
BEGIN;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS usuario_id BIGINT REFERENCES usuarios(id_usuario);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
COMMIT;
