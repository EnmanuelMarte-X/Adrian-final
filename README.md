# **A G3deon For Enterprises Project**

En caso de querer correr el proyecto, solo deben clonar el repositorio utilizando el siguiente comando:

```
git clone https://github.com/EnmanuelMarte-X/Adrian-final.git
```

Luego, entren a la carpeta del proyecto:

```
cd Adrian-final
```

Una vez dentro, pueden levantar los contenedores con:

```
docker compose up
```

En sistemas Linux, el comando puede variar a:

```
docker-compose up
```

Si desean asignar un nombre personalizado al proyecto, pueden utilizar el parámetro **-p**:

```
docker compose -p nombre_del_proyecto up
```

En caso de que ocurra algún error, verifique que su máquina tenga suficiente almacenamiento, ya que el proyecto es algo pesado.

---

## **Información importante sobre los servicios**

El proyecto levanta **tres contenedores**:

### **1. Aplicación principal**

* Corre en: **[http://localhost:3000](http://localhost:3000)**

### **2. Mongo Express**

* Corre en: **[http://localhost:8000](http://localhost:8000)**
* Para acceder necesitarán las credenciales por defecto:

  * **Usuario:** `admin`
  * **Contraseña:** `admin123`
* Aquí podrán visualizar la base de datos MongoDB.

### **3. MongoDB**

* Corre también en su **puerto por defecto (27017)**.

---

## **Credenciales de acceso a la aplicación**

La aplicación incluye un usuario creado por defecto:

* **Email:** `admin@admin.com`
* **Contraseña:** `admin1234`

También puede registrarse y crear su propio usuario si así lo desea.

---
