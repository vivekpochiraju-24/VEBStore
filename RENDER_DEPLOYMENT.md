# 🚀 Deploying VEBStore to Render

I have prepared your project for a **one-click deployment** using a **Render Blueprint**. This will automatically host your Backend, Frontend, and Admin portal at the same time.

### 📝 Step 1: Connect your GitHub
1.  Log in to [Render.com](https://dashboard.render.com/).
2.  Click **"New +"** and select **"Blueprint"**.
3.  Connect your GitHub repository: `https://github.com/vivekpocaju-24/VEBStore`.
4.  Render will find the `render.yaml` file and automatically detect three services:
    *   `vebstore-backend` (Web Service)
    *   `vebstore-frontend` (Static Site)
    *   `vebstore-admin` (Static Site)

### 🔑 Step 2: Set your Environment Variables
Render will ask you to fill in the following values for the **Backend**:
*   `MONGODB_URL`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://...`).
*   `JWT_SECRET`: A secure random string (e.g., `EWQS25554cfdXHWSJW4Y53`).
*   `ADMIN_EMAIL`: Your admin email (e.g., `bhargavisurampudi1@gmail.com`).
*   `ADMIN_PASSWORD`: Your admin password (e.g., `bhargavi10`).
*   `CLOUDINARY_NAME`: `dz0cz6vh6`
*   `CLOUDINARY_API_KEY`: `383788324265289`
*   `CLOUDINARY_API_SECRET`: `oRpeNB9P19S1Yzm59_cJ2LKbKcs`
*   `EMAIL_USER`: `vivekpochiraju@gmail.com`
*   `EMAIL_PASS`: `dzrfkjyaqpyyzpuu`
*   `RAZORPAY_KEY_ID`: `rzp_test_SSMJtAPB3B3MTE`
*   `RAZORPAY_KEY_SECRET`: `k0XzdHve1pZrvferS8SdRsQm`

### 🌐 Step 3: Deploy & URLs
1.  Click **"Approve"** or **"Apply"**.
2.  Render will first build the **Backend**. Once it's up, it will automatically build the **Frontend** and **Admin** sites.
3.  The Frontend and Admin will automatically "know" your Backend's URL through the `VITE_BACKEND_URL` environment variable I configured in the Blueprint.

### 🛡️ CORS Note
I have updated your Backend's CORS policy to automatically accept any URL ending in `.onrender.com`, so your frontend should be able to communicate with the API immediately!
