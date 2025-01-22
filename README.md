## Demo Overview

This demo demonstrates the bare minimum needed to authenticate with Canva, allow a user to create a design, retrieve an image of that design, and send it to a server.

## Design Considerations

- **Vanilla JavaScript**: The project uses vanilla JavaScript instead of TypeScript to keep the code clean and simple. In production, you might want to use TypeScript and a real UI framework like React or Vue.
- **Bootstrap CDN**: It leverages a CDN for Bootstrap to avoid the need for extensive embedded CSS. Bootstrap is not a requirement and is only included to enhance the demo's appearance.
- **Simple HTML Files**: The HTML files are straightforward, with script tags ensuring that all event listeners are located near the buttons that activate them.

## Highlights

- **[/public/index.html](./public/index.html)**: This is the main view for the application and has three states (User Logged Out, Handling Canva Return Request, and Displaying the User's Canva Design).
- **[/src/index.js](./src/index.js)**: All the route logic to connect to Canva is in this file.
- **[/public/canva_endpoints.js](./public/canva_endpoints.js)**: This includes a fetch utility function to send your Canva auth token to any Canva REST API endpoints. If you want to wrap the API without using a full API generator like the Canva quickstart, you would add those functions here.

You can mostly ignore the other files since they contain boilerplate to make the demo work (basic SQLite database, uploads folder, etc.).

## How to Run The Demo

1. **Set Up Canva Developer Account**:

   - Go to the [Canva Developer Portal](https://www.canva.com/developers/).
   - Create a new app and obtain your API keys.

2. **Clone the Repository**:

   ```sh
   git clone https://github.com/NTBooks/minimal-canva-demo.git
   cd minimal-canva
   ```

3. **Rename the .env File**:

   ```sh
   mv .env.sample .env
   ```

4. **Add Your Canva API Keys**:

   - Open the `.env` file and add your Canva API keys.

5. **Install Dependencies**:

   ```sh
   npm install
   ```

6. **Run the Demo**:

   ```sh
   npm run start
   ```

7. **Access the Application**:
   - Open your browser and go to `http://localhost:3001` or whatever port you set in the .env file.

Follow these steps to authenticate with Canva, create a design, retrieve an image of that design, and send it to a server.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
