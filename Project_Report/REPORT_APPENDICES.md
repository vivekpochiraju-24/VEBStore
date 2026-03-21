# 📚 Appendices: Project Documentation Set

This chapter provides a detailed overview of the project documentation set, including the API list, technical stack, and setup guide.

## A.1 Complete API List (Reference Index)
| Module | Endpoint | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/login` | POST | Secure Login Gateway |
| **Auth** | `/api/auth/google` | POST | Social Identity Provider |
| **User** | `/api/user/profile`| PUT | Global Profile Update |
| **Product**| `/api/product/add` | POST | Multi-image Catalog Add |
| **Cart** | `/api/cart/update` | POST | Persistent Bag Sync |
| **Order** | `/api/order/place` | POST | Finalized Transaction |
| **Stats** | `/api/order/stats` | GET | Real-time Revenue Pull |

## A.2 Specialized Technical Stack
- **Frontend Core**: React 19 + Vite (Next-gen bundling)
- **Styling Standards**: Tailwind CSS 4 (Utility-first excellence)
- **Backend Architecture**: Node.js + Express 5 (Modular controllers)
- **Database Model**: MongoDB Atlas + Mongoose (Document-driven)
- **Digital Infrastructure**: Cloudinary (Asset CDN), Razorpay (Payment), Nodemailer (SMTP)

## A.3 Deployment Readiness (Netlify)
- **Base Paths**: Optimized monorepo structure.
- **Routing Fix**: `_redirects` ensures SPA stability.
- **Branding**: Custom Favicons deployed for boutique and admin.

---
*VEBStore · Final Year Project Documentation Series*
