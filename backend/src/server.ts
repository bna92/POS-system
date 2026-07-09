import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import saleRoutes from "./routes/sale.routes";
import customerRoutes from "./routes/customer.routes";
import supplierRoutes from "./routes/supplier.routes";
import userRoutes from "./routes/user.routes";
import purchaseRoutes from "./routes/purchase.routes";
import inventoryRoutes from "./routes/inventory.routes";
import cashRegisterRoutes from "./routes/cashRegister.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import reportRoutes from "./routes/report.routes";
import { errorHandler } from "./middleware/error.middleware";
import { authMiddleware } from "./middleware/auth.middleware";
import { requireRole } from "./middleware/role.middleware";

dotenv.config();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL?.split(",").map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(authMiddleware);

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/users", requireRole("admin"), userRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/cash-register", cashRegisterRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`POS backend running on port ${PORT}`);
});