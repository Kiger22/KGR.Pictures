# KGR Pictures API

Este proyecto es una API REST para gestionar álbumes de fotos, donde los usuarios pueden crear álbumes, agregar fotos, compartir álbumes con otros usuarios y reaccionar a las fotos mediante "likes". Las imágenes se almacenan en Cloudinary, y el proyecto está basado en Node.js y MongoDB.

## Funcionalidades

- **Crear álbumes**: Los usuarios pueden crear álbumes, agregar fotos, y establecer si el álbum es público o privado.
- **Agregar fotos**: Permite a los usuarios agregar una o varias fotos a sus álbumes.
- **Likes en fotos**: Los usuarios pueden dar "like" o eliminar su "like" de las fotos.
- **Compartir álbumes**: Los usuarios pueden compartir álbumes con otros usuarios.
- **Sistema de autenticación**: Acceso restringido a usuarios autenticados.
- **Subida de imágenes a Cloudinary**: Las fotos se almacenan en la nube a través del servicio de Cloudinary.

## Tecnologías Utilizadas

- **Node.js**:    Entorno de ejecución para JavaScript del lado del servidor.
- **Express.js**: Framework para la creación de aplicaciones web en Node.js.
- **MongoDB**:    Base de datos NoSQL para almacenar los álbumes, fotos y usuarios.
- **Mongoose**:   ODM para MongoDB y Node.js.
- **Cloudinary**: Servicio para el almacenamiento de imágenes en la nube.
- **Multer**:     Middleware para el manejo de archivos en las solicitudes HTTP.
- **JWT**:        Para la autenticación de usuarios mediante tokens.
- **bcrypt**:     Para el cifrado de contraseñas.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Kiger22/KGR.Pictures
cd Backend
```

### 2. Instalar dependencias

Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu máquina y ejecuta

```bash
npm install
```

#### 3. Crear archivo _**.env**_

En nuestro caso ya lo proporcionamos en el repositorio del proyecto

```bash
MONGODB_URL=mongodb://localhost:<ID>/<password>
JWT_SECRET=<tu_secreto_para_jwt>

CLOUDINARY_CLOUD_NAME=<tu_cloud_name>
CLOUDINARY_API_KEY=<tu_api_key>
CLOUDINARY_API_SECRET=<tu_api_secret>
```

#### 4. Inicia el servidor

```bash
npm run dev
```

## Autenticación

El sistema usa **JWT** para la autenticación. Los usuarios deben registrarse y autenticarse para crear álbumes, agregar fotos y reaccionar a las fotos.

### Registro de usuario

**`POST /auth/register`**

```json
{
  "username": "usuarioEjemplo",
  "password": "contraseñaEjemplo",
  "email": "email@example.com"
}
```

### Inicio de sesión

**`POST /auth/login`**

```json
{
  "username": "usuarioEjemplo",
  "password": "contraseñaEjemplo"
}
```

Obtendrás un token JWT que deberás incluir en el header de las siguientes peticiones.

---

## Uso de la API

### Crear un Álbum

**`POST /albums`**

#### Requiere autenticación (JWT)

```json
{
  "title": "Titulo del Album",
  "description": "Álbum de fotos",
  "isPublic": true || false
}

```

### Agregar fotos a un Álbum

**`POST /albums/:albumId/photos`**

**_Requiere autenticación (JWT)_**

Este endpoint permite subir una o varias fotos. Debes enviar un archivo a través de
**`multipart/form-data`**.

```bash
POST "http://localhost:3000/albums/ID_DEL_ALBUM/photos" \
-H "Authorization: Bearer TOKEN_JWT" \
-F "photos=@/ruta/a/la/foto1.jpg" \
-F "photos=@/ruta/a/la/foto2.jpg"
```

### Reaccionar a una Foto (Like)

**`PUT /photos/:photoId/like`**

**_Requiere autenticación (JWT)_**


```bash
PUT "http://localhost:3000/photos/ID_DE_LA_FOTO/like" \
-H "Authorization: Bearer TOKEN_JWT"
```

### Obtener Álbumes Públicos

**`GET /albums/public`**

Este endpoint lista todos los álbumes que son públicos.

---

## Funcionalidades Adicionales

- ### Compartir álbumes

  - **`PUT /albums/:albumId/share`** permite compartir un álbum con otros usuarios.

- ### Eliminar fotos

  - **`DELETE /albums/:albumId/photos`** permite eliminar una o varias fotos de un álbum.

- ### Obtener fotos populares

  - **`GET /photos/popular`** lista las fotos con más likes.

---

- ### Otros

| Método  | Endpoint                          | Descripción                                   |
|---------|------------------------------------|-----------------------------------------------|
| **GET** | `/categories`                     | Obtener todas las categorías.                 |
| **GET** | `/categories/:id`                 | Obtener una categoría por ID.                 |
| **GET** | `/categories/name/:name`          | Obtener categorías por nombre.                |
| **POST**| `/categories`                     | Agregar una nueva categoría.                  |
| **PUT** | `/categories/:id`                 | Actualizar una categoría existente.           |
| **DELETE**| `/categories/:id`               | Eliminar una categoría.                       |

## Estructura del Proyecto

```bash
├── api/  
  ├── controllers/  # Controladores de la API
  ├── models/       # Modelos de Mongoose
  ├── routes/       # Definición de rutas
├── config/         # Configuración de Cloudinary y otros servicios
├── middleware/     # Middlewares como autenticación o manejo de archivos
└── utils/          # Semillas y manejo de cloudinary
.env                # Variables de entorno (no debe subirse al repositorio)
README.md           # Este archivo
```

---

## Seguridad

- Cifrado de contraseñas: Usamos **`bcrypt`** para cifrar las contraseñas de los usuarios antes de almacenarlas.
- Autenticación **JWT**: Implementamos un sistema de autenticación mediante tokens que asegura que solo usuarios autenticados puedan acceder a ciertas rutas.

## Autores

Este proyecto Esta realizado por _Guillermo Mendoza_

- **Kiger22** - _Proyecto_ - [LinkedIn](www.linkedin.com/in/guillermo-mendoza-costa-46a87744)

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue los siguientes pasos:

- Haz un fork del repositorio.
- Crea una nueva rama para tu funcionalidad (git checkout -b nueva-funcionalidad).
- Haz commit de tus cambios (git commit -m 'Añadir nueva funcionalidad').
- Haz push a la rama (git push origin nueva-funcionalidad).
- Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles

## Expresiones de Gratitud

- Rock the Code  
- Gracias por las contribuciones, feedback y correcciones.

---

**⌨️ por [kiger22](https://github.com/Kiger22)**
