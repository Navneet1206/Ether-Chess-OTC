# Contribute to the Online Chess Game Project

Thank you for your interest in contributing to the Online Chess Game project! Below is a detailed guide on the current issues and how you can help improve the project.

---

## Project Overview
This is an online chess platform built using React, Ethereum, and Web3.js. Players can connect their wallets, make payments in ETH, and start chess games. While the core functionality is in place, there are some bugs and areas for improvement.

---

## Current Issues

### 1. **Drag-and-Drop Chess Piece Movement (High Priority)**
   - **Description**: Currently, players must hold and drag a chess piece to its desired position. This behavior is unintuitive and disrupts gameplay.
   - **Improvement**: Implement a smoother drag-and-drop functionality or enable single-click selection and movement for a better user experience.

---

### 2. **Pawn Promotion Bug**
   - **Description**: When a pawn reaches the last rank for promotion, the game gets stuck, and no promotion options are shown.
   - **Improvement**:
     1. Fix the logic to detect when a pawn reaches the promotion rank.
     2. Display a modal or dropdown to select the desired piece (Queen, Rook, Bishop, Knight).
     3. Ensure the game resumes seamlessly after promotion.

---

### 3. **Chess Game Loading Issue**
   - **Description**: After connecting the wallet and making a payment, the chess game occasionally fails to load, resulting in a white screen.
   - **Improvement**: Debug the chessboard component's state and props to ensure they initialize correctly. Verify dependencies and WebSocket connections.

   **Error Preview**:  
   ![Error Screenshot](./MockDown%20images/whitescreen.png)

   ```error
   socketService.ts:21 WebSocket connection to 'ws://localhost:3001/socket.io/?address=0xbf786287609d1e4bfa96794893fc899ae957f484&username=Player&EIO=4&transport=websocket' failed: WebSocket is closed before the connection is established.
   setTimeoutconnect@socketService.ts:21handleCreateGame@OnlineMode.tsx:75
   socketService.ts:39 Socket connected successfully
   socketService.ts:47 Game created with ID: 3gik7tpb
   ```

---

### 4. **Alerts Instead of Popups**
   - **Location**: Multiple files, primarily `src/components/OnlineMode.jsx`
   - **Description**: The application currently uses `alert()` for notifications, which is disruptive and not user-friendly.
   - **Improvement**: Replace `alert()` with a modal-based popup component for better UX.

   

---

### 5. **Missing Loaders**
   - **Location**: `src/components/OnlineMode.jsx`
   - **Description**: There is no indication of ongoing processes such as connecting to the wallet, making a payment, or loading the game.
   - **Improvement**: Add loaders to show progress for the following actions:
     - Wallet connection
     - Payment processing
     - Chess game initialization



---

### 6. **Add Input Validation**
   - **Location**: `src/components/OnlineMode.jsx`
   - **Description**: The input fields (e.g., stake amount) do not have proper validation, leading to potential errors or misuse.
   - **Improvement**: Add validations to ensure:
     - Stake amounts are positive integers.
     - All required fields are filled before proceeding.

---

### 7. **Suggested Features**
   - **Enhance User Interface**: Improve the layout and aesthetics of the chess game and wallet integration screens.
   - **Add Sound Effects**: Provide sound feedback for actions like moves, payments, and connection success.
   - **Game History**: Display a log of moves made during the chess game.
   - **Dynamic Theme**: Allow users to switch between light and dark themes.

---

## How to Contribute

### Step 1: Fork and Clone the Repository
```bash
# Clone the repository
git clone https://github.com/your-repo/online-chess-game.git
cd online-chess-game
```

### Step 2: Set Up the Development Environment
Follow the instructions in the `README.md` file to set up your local environment.

### Step 3: Address Specific Issues

#### For **Drag-and-Drop Movement**:
- Review the chessboard component handling piece movement.
- Use libraries like `react-dnd` for implementing robust drag-and-drop functionality.

#### For **Pawn Promotion**:
- Add logic to detect pawn promotion conditions.
- Use a modal to display promotion options and update the game state accordingly.

#### For **Alerts Instead of Popups**:
- Replace existing `alert()` calls with a custom modal component using libraries like `react-modal` or `Material-UI`.
- Ensure the modal design aligns with the app’s UI and offers dismissible options.

### Step 4: Test Your Changes
1. Run the application locally:
   ```bash
   npm start
   ```
2. Test various scenarios, such as moving pieces, pawn promotion, and responsive navigation.
3. Ensure no regressions are introduced.

### Step 5: Submit a Pull Request
1. Push your changes to your forked repository.
2. Open a pull request with a clear description of your changes and reference the issue numbers you are addressing.

---

## Contact
If you have any questions or need guidance, feel free to open an issue or reach out to the project maintainer.

Happy Coding!