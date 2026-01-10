# GenDescribe - Generador de Descripciones con IA

Esta es una aplicación web minimalista construida con React, TypeScript y TailwindCSS que utiliza la API de Google Gemini para generar descripciones de productos multilingües.

## Cómo ejecutar localmente

1.  Clona este repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en la raíz del proyecto y añade tu API Key de Gemini:
    ```
    API_KEY=tu_clave_api_aqui
    ```
    *(Nota: En entornos locales necesitarás configurar Vite para exponer esta variable o ajustarlo en el código, p.ej. `VITE_API_KEY`)*.

4.  Ejecuta el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## Tecnologías

*   React 19
*   TypeScript
*   Tailwind CSS (vía CDN para simplicidad)
*   Google GenAI SDK
*   Lucide React (Iconos)
