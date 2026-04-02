

-- 2. LIMPIEZA DE TABLAS 
DROP TABLE IF EXISTS reseñas CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS horarios CASCADE;
DROP TABLE IF EXISTS canchas CASCADE;
DROP TABLE IF EXISTS tipo_canchas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TYPE IF EXISTS "enum_usuarios_rol" CASCADE;
-- 3. CREACIÓN DE TABLAS

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Usamos 'password' para Sequelize
    rol VARCHAR(20) CHECK (rol IN ('admin', 'cliente')) DEFAULT 'cliente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM tipo_canchas 


SELECT setval('tipo_canchas_id_seq', (SELECT MAX(id) FROM tipo_canchas));

INSERT INTO tipo_canchas (nombre, createdat, updatedat) VALUES 
('Fútbol 5', NOW(), NOW()),
('Fútsal', NOW(), NOW()),
('Básquetbol', NOW(), NOW()),
('Vóleibol', NOW(), NOW()),
('Tenis', NOW(), NOW()),
('Raquetbol', NOW(), NOW()),
('Gimnasio', NOW(), NOW());
INSERT INTO tipo_canchas (nombre, createdat, updatedat) 
VALUES ('Pádel', NOW(), NOW());
-- Tabla de Tipos de Cancha
CREATE TABLE tipo_canchas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Canchas
CREATE TABLE canchas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_id INT REFERENCES tipo_canchas(id) ON DELETE SET NULL,
    precio_por_hora DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('activa', 'inactiva')) DEFAULT 'activa',
    imagen_url VARCHAR(255) DEFAULT 'https://via.placeholder.com/300',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Horarios
CREATE TABLE horarios (
    id SERIAL PRIMARY KEY,
    cancha_id INT REFERENCES canchas(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE horarios 
ADD CONSTRAINT unique_horario_cancha 
UNIQUE (cancha_id, fecha, hora_inicio, hora_fin);

-- Tabla de Reservas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    horario_id INT REFERENCES horarios(id) ON DELETE CASCADE,
    total_pago DECIMAL(10,2),
    estado VARCHAR(20) CHECK (estado IN ('confirmada', 'cancelada')) DEFAULT 'confirmada',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
    ALTER TABLE reservas DROP CONSTRAINT reservas_estado_check;
ALTER TABLE reservas ADD CONSTRAINT reservas_estado_check 
CHECK (estado IN ('confirmada', 'cancelada', 'pagada'));
);

-- Tabla de Reseñas
CREATE TABLE reseñas (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    cancha_id INT REFERENCES canchas(id) ON DELETE CASCADE,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, cancha_id) -- Evita spam de reseñas
);

SELECT id, descripcion FROM tipo_canchas;

SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'tipo_canchas';
-- (TRIGGERS Y PROCEDIMIENTOS)

-- TRIGGER 1: Marcar horario como ocupado automáticamente al reservar
CREATE OR REPLACE FUNCTION fn_marcar_ocupado()
RETURNS TRIGGER AS $$BEGIN
    UPDATE horarios SET disponible = FALSE WHERE id = NEW.horario_id;
    RETURN NEW;
END;$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_al_reservar
AFTER INSERT ON reservas
FOR EACH ROW EXECUTE FUNCTION fn_marcar_ocupado();

-- TRIGGER 2: Volver a poner disponible si se cancela la reserva
CREATE OR REPLACE FUNCTION fn_liberar_horario()
RETURNS TRIGGER AS $$BEGIN
    IF (NEW.estado = 'cancelada') THEN
        UPDATE horarios SET disponible = TRUE WHERE id = NEW.horario_id;
    END IF;
    RETURN NEW;
END;$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_al_cancelar
AFTER UPDATE ON reservas
FOR EACH ROW EXECUTE FUNCTION fn_liberar_horario();

-- PROCEDIMIENTO: Generar horarios automáticamente (Para que el admin no sufra)
CREATE OR REPLACE PROCEDURE pr_generar_slots(p_cancha_id INT, p_fecha DATE, p_inicio TIME, p_fin TIME)
AS $$DECLARE
    v_actual TIME := p_inicio;
BEGIN
    WHILE v_actual < p_fin LOOP
        INSERT INTO horarios (cancha_id, fecha, hora_inicio, hora_fin)
        VALUES (p_cancha_id, p_fecha, v_actual, v_actual + interval '1 hour');
        v_actual := v_actual + interval '1 hour';
    END LOOP;
END;$$ LANGUAGE plpgsql;


SELECT id, nombre, email, password, rol FROM usuarios;

INSERT INTO canchas (nombre, tipo_id, precio_por_hora, estado, imagen_url, createdat, updatedat) 
VALUES ('Cancha Maracaná', 1, 150.00, 'activa', 'maracana.jpg', NOW(), NOW());

-- Aseguramos que existan los tipos básicos
INSERT INTO tipo_canchas (id, nombre) VALUES (1, 'Fútbol 7') ON CONFLICT (id) DO NOTHING;
INSERT INTO tipo_canchas (id, nombre) VALUES (2, 'Fútbol 11') ON CONFLICT (id) DO NOTHING;


INSERT INTO horarios (cancha_id, fecha, hora_inicio, hora_fin, disponible) 
VALUES (1, '2026-04-01', '19:00:00', '20:00:00', TRUE);

INSERT INTO horarios (cancha_id, fecha, hora_inicio, hora_fin, disponible) 
VALUES (1, '2026-04-01', '20:00:00', '21:00:00', TRUE);

INSERT INTO tipo_canchas (id, nombre) 
VALUES (1, 'Fútbol 7') 
ON CONFLICT (id) DO NOTHING;

INSERT INTO canchas (id, nombre, tipo_id, precio_por_hora, estado, imagen_url) 
VALUES (1, 'Cancha Maracaná', 1, 150.00, 'activa', 'maracana.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO horarios (cancha_id, fecha, hora_inicio, hora_fin, disponible) 




VALUES (1, '2026-04-01', '19:00:00', '20:00:00', TRUE);
SELECT id, nombre FROM canchas;


INSERT INTO horarios (cancha_id, fecha, hora_inicio, hora_fin, disponible, createdat, updatedat) 
VALUES (
    1, 
    '2026-04-01', 
    '19:00:00', 
    '20:00:00', 
    TRUE, 
    NOW(), 
    NOW()
);

SELECT h.id as horario_id, c.nombre as nombre_cancha, h.hora_inicio, h.disponible
FROM horarios h
JOIN canchas c ON h.cancha_id = c.id;

- Inserta un par de canchas
INSERT INTO canchas (nombre, tipo_id, precio_por_hora, estado) 
VALUES ('Cancha Los Amigos', 1, 100.00, 'activa');

INSERT INTO canchas (nombre, tipo_id, precio_por_hora, estado) 
VALUES ('Estadio Central', 1, 150.00, 'activa');


-- Insertar horarios para la Cancha Maracaná (asumiendo cancha_id = 1)
INSERT INTO horarios (cancha_id, fecha, hora_inicio, hora_fin, disponible)
VALUES 
(1, '2026-03-31', '08:00:00', '09:00:00', true),
(1, '2026-03-31', '09:00:00', '10:00:00', true),
(1, '2026-03-31', '10:00:00', '11:00:00', true),
(1, '2026-03-31', '19:00:00', '20:00:00', true);





ALTER TABLE horarios 
ADD CONSTRAINT unique_horario_cancha 
UNIQUE (cancha_id, fecha, hora_inicio, hora_fin);

DELETE FROM horarios;

ALTER TABLE horarios 
ADD CONSTRAINT unique_horario_cancha 
UNIQUE (cancha_id, fecha, hora_inicio, hora_fin);

INSERT INTO horarios (cancha_id, fecha, hora_inicio, hora_fin, disponible)
VALUES (1, '2026-04-01', '19:00:00', '20:00:00', true);


INSERT INTO usuarios (nombre, correo, password, rol) 
VALUES ('Administrador', 'admin@admin.com', '$2b$10$vI8AzWugPszJD9E8.E8m8e6WfS1W6S6S6S6S6S6S6S6S6S6S6S6S6', 'admin');

UPDATE usuarios 
SET password = '$2b$10$p4.d.jqqw.9oj9ExKwy0aeggJKzwmw7Z27s1B7lvuNZV5ZSkKqa4y' 
WHERE email = 'admin@admin.com';

INSERT INTO tipos_canchas (descripcion, created_at, updated_at) VALUES 
('Fútbol 7', NOW(), NOW()),
('Fútbol 11', NOW(), NOW()),
('Tenis (Arcilla)', NOW(), NOW()),
('Pádel', NOW(), NOW()),
('Básquetbol', NOW(), NOW());