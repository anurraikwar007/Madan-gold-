import DashboardService from "../services/dashboard.service.js";

class DashboardController {
  // =====================================================
  // Complete Dashboard
  // =====================================================

  async getDashboard(
    req,
    res,
    next
  ) {
    try {
      const dashboard =
        await DashboardService.getDashboard();

      return res.status(200).json({
        success: true,
        message:
          "Dashboard fetched successfully.",
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Dashboard Analytics
  // =====================================================

  async getAnalytics(
    req,
    res,
    next
  ) {
    try {
      const analytics =
        await DashboardService.getAnalytics();

      return res.status(200).json({
        success: true,
        message:
          "Analytics fetched successfully.",
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Product Statistics
  // =====================================================

  async getProductStatistics(
    req,
    res,
    next
  ) {
    try {
      const statistics =
        await DashboardService.getProductStatistics();

      return res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Category Statistics
  // =====================================================

  async getCategoryStatistics(
    req,
    res,
    next
  ) {
    try {
      const statistics =
        await DashboardService.getCategoryStatistics();

      return res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }
    // =====================================================
  // Order Statistics
  // =====================================================

  async getOrderStatistics(
    req,
    res,
    next
  ) {
    try {
      const statistics =
        await DashboardService.getOrderStatistics();

      return res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Revenue Statistics
  // =====================================================

  async getRevenueStatistics(
    req,
    res,
    next
  ) {
    try {
      const statistics =
        await DashboardService.getRevenueStatistics();

      return res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Customer Statistics
  // =====================================================

  async getCustomerStatistics(
    req,
    res,
    next
  ) {
    try {
      const statistics =
        await DashboardService.getCustomerStatistics();

      return res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Monthly Sales
  // =====================================================

  async getMonthlySales(
    req,
    res,
    next
  ) {
    try {
      const sales =
        await DashboardService.getMonthlySales();

      return res.status(200).json({
        success: true,
        data: sales,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Recent Orders
  // =====================================================

  async getRecentOrders(
    req,
    res,
    next
  ) {
    try {
      const limit =
        Number(req.query.limit) || 10;

      const orders =
        await DashboardService.getRecentOrders(
          limit
        );

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Top Selling Products
  // =====================================================

  async getTopSellingProducts(
    req,
    res,
    next
  ) {
    try {
      const limit =
        Number(req.query.limit) || 10;

      const products =
        await DashboardService.getTopSellingProducts(
          limit
        );

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();