const db = require('../config/database'); // Asegúrate de que esta es tu conexión a PostgreSQL
const bcrypt = require('bcrypt');

class Usuario {
    static async crear(nombre, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
      INSERT INTO usuarios (nombre, email, password)
      VALUES ($1, $2, $3) RETURNING id
    `;
        const values = [nombre, email, hashedPassword];

        // Ejecuta la consulta y retorna el id insertado
        const result = await db.query(query, values);
        return result.rows[0].id;  // PostgreSQL devuelve la fila en "rows"
    }

    static async buscarPorEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const values = [email];

        const result = await db.query(query, values);
        return result.rows[0];  // Devuelve el primer usuario encontrado
    }

    static async buscarPorId(id) {
        const query = 'SELECT id, nombre, email, created_at FROM usuarios WHERE id = $1';
        const values = [id];

        const result = await db.query(query, values);
        return result.rows[0];  // Devuelve el usuario por id
    }
}

module.exports = Usuario;