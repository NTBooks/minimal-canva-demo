## Demo Overview

This demo is designed to show the bare minimum needed to authenticate with Canva, allow a user to create a design, retrieve an image of that design, and send it to a server. It uses vanilla JavaScript instead of TypeScript to keep the code clean and simple. Additionally, it leverages a CDN for Bootstrap to avoid the need for extensive embedded CSS. The HTML files are straightforward, with script tags ensuring that all event listeners are located near the buttons that activate them.

## Design Considerations

- **Vanilla JavaScript**: The project uses vanilla JavaScript instead of TypeScript to keep the code clean and simple. In production you probably will want to use typescript and a real UI framework like React, Vue, etc.
- **Bootstrap CDN**: It leverages a CDN for Bootstrap to avoid the need for extensive embedded CSS. Bootstrap is not a requirement and only there to make the demo look nicer 😊
- **Simple HTML Files**: The HTML files are straightforward, with script tags ensuring that all event listeners are located near the buttons that activate them.

## Highlights

- **/public/index.html**: This is the main view for the application and has three states (User Logged Out, Handling Canva Return Request, and Displaying the User's Canva Design)
- **/src/index.js**: All the route logic to connect to canva is in this file
- **/public/canva_endpoints.js**: This includes a fetch utility function to send your canva auth token to any canva REST API endpoints. If you want to wrap the API without using a full API generator like the canva quickstart you would add those functions here.

You can mostly ignore the other files since they contain boilerplate to make the demo work (basic sqlite database, uploads folder, etc.)

## How to Run The Demo

1. **Set Up Canva Developer Account**:

   - Go to the [Canva Developer Portal](https://www.canva.com/developers/).
   - Create a new app and obtain your API keys.

2. **Clone the Repository**:

   ```sh
   git clone https://github.com/NTBooks/minimal-canva.git
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
