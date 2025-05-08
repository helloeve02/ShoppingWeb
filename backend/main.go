package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"

	// "github.com/sut67/team17/controller"

	// "google.golang.org/protobuf/internal/order" deploy

	"github.com/sut67/team17/controller/address"
	"github.com/sut67/team17/controller/brands"
	"github.com/sut67/team17/controller/cart"
	"github.com/sut67/team17/controller/categories"
	"github.com/sut67/team17/controller/genders"
	"github.com/sut67/team17/controller/invoice"
	"github.com/sut67/team17/controller/notification"
	orders "github.com/sut67/team17/controller/orders"
	"github.com/sut67/team17/controller/payment"
	"github.com/sut67/team17/controller/product_status"
	"github.com/sut67/team17/controller/products"
	"github.com/sut67/team17/controller/promotion_product"
	"github.com/sut67/team17/controller/promotion_status"
	"github.com/sut67/team17/controller/promotions"
	"github.com/sut67/team17/controller/shipping"
	"github.com/sut67/team17/controller/user_promotion"
	"github.com/sut67/team17/controller/users"
	"github.com/sut67/team17/controller/wallet"

	order "github.com/sut67/team17/controller/order"
	"github.com/sut67/team17/middlewares"

	articles "github.com/sut67/team17/controller/article"
	"github.com/sut67/team17/controller/helpcenter"
	"github.com/sut67/team17/controller/helpcenterstatus"
	"github.com/sut67/team17/controller/mailbox"
	"github.com/sut67/team17/controller/returns"
	"github.com/sut67/team17/controller/review"

	topics "github.com/sut67/team17/controller/topic"
	transaction "github.com/sut67/team17/controller/transaction"
)

const PORT = "8000" //ต้องเอาออกตอน deploy

func main() {

	// open connection database

	config.ConnectionDB()

	// Generate databases

	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	// Auth Route

	r.POST("/signup", users.SignUp)
	r.POST("/signin", users.SignIn)
	r.PUT("/ResetPasswordUser", users.ResetPasswordUser)
	r.GET("/users/:id", users.GetUserByID)
	r.PATCH("/ChangePassword/:id", users.ChangePasswordUser)
	router := r.Group("/")

	{
		router.Use(middlewares.Authorizes())

		router.GET("/users", users.ListUsers)
		router.POST("/users", users.CreateUser)
		router.PUT("/users/:id", users.UpdateUserByid)
		router.DELETE("/users/:id", users.DeleteUser)

		router.GET("/cartitem", cart.GetCartitem)
		router.GET("/cartitem/:id", cart.GetCartItemByID)
		router.POST("/cartitem", cart.CreateCart)
		router.PATCH("/cartitem/:id", cart.UpdateCart)
		router.DELETE("/cartitem/:id/:productID", cart.DeleteCartitemByProductID)
		router.DELETE("/cartitem/:id",cart.DeleteCartitem)

		router.GET("/products", products.GetAllProducts)
		router.GET("/products/:id", products.GetProductByID)
		router.GET("/products/user/:id", products.GetProductsByUserID)
		router.POST("/products", products.CreateProduct)
		router.PATCH("/products/:id", products.UpdateProduct)
		router.DELETE("/products/:id", products.DeleteProduct)
		router.GET("/categories", categories.GetAllCategories)
		router.GET("/brands", brands.GetAllBrands)
		router.GET("/product_status", product_status.GetAllProductStatus)

		router.GET("/promotions", promotions.GetAllPromotion)
		router.GET("/promotions/:id", promotions.GetPromotionByID)
		router.POST("/promotions", promotions.CreatePromotion)
		router.DELETE("/promotions/:id", promotions.DeletePromotion)
		router.PATCH("/promotions/:id", promotions.UpdatePromotion)
		router.GET("/promotion_status", promotion_status.GetAllPromotionStatus)
		router.GET("/promotion_product", promotion_product.GetAllPromotionProduct)
		router.GET("/user_promotion", user_promotion.GetAllUserPromotion)
		router.GET("/genders", genders.GetAll)

		router.GET("/payments", payment.ListPayments)
		router.GET("/payment/:id", payment.ListPaymentByID)
		router.POST("/payment", payment.CreatePayment)
		router.PUT("/payment/:id", payment.UpdatePaymentByUserID)
		router.DELETE("/payment/:id", payment.DeletePayment)
		router.PUT("/payments/:payment_id/update-status-Cancel", payment.UpdatePaymentStatusCancel)
		router.PUT("/payments/:payment_id/update-status-Verify", payment.UpdatePaymentStatusVerify)
		router.GET("/paymentstatus/:id", payment.GetPaymentStatusByID)
		//CreateOrderItem
		router.GET("/order/:id", order.GetOrderByID)
		router.DELETE("/order/:id", order.DeleteOrder)
		router.POST("/order", order.CreateOrder)
		router.PUT("/order/:id", order.UpdateOrderByUserID)
		router.POST("/orderitem", order.CreateOrderItem)

		// Order Routes
		r.PATCH("/orders-recieved/:id",orders.RecievedOrder)
		r.GET("/orders/item/:id",orders.GetOrderItemsByUserID)
		r.PATCH("/return-order/:id",orders.ReturnOrder)
		r.GET("/invoice/user/:id", orders.GetInvoiceByUserID)
		r.GET("/invoice/order/:id", orders.GetInvoiceByOrderID)
		r.PATCH("/wallet/user/:id/:totalPrice", orders.UpdateWalletForSellerByID)
		r.GET("/user/shop-name/:id",orders.GetShopNameByUserID)

		// Return Routes
		r.POST("/return", returns.CreateReturn)
		r.GET("/return-request", returns.GetReturnRequest)
		r.GET("/return-managed", returns.GetReturnManaged)
		r.GET("/return-approved/:id", returns.GetReturnApproved)
		r.GET("/return-refunded/:id", returns.GetReturnRefunded)
		r.GET("/return-type", returns.GetReturnTypes)
		r.GET("/return-reason", returns.GetReturnReasons)
		r.PATCH("/return-approve/:id", returns.ApproveReturn)
		r.PATCH("/return-deny/:id", returns.DenyReturn)
		r.PATCH("/return-refund/:id", returns.RefundReturn)

		// Invoice Routes
		r.POST("/invoice", invoice.CreateInvoice)
		r.GET("/invoice", invoice.GetInvoices)
		r.GET("/invoice-type", invoice.GetInvoiceTypes)
		r.PATCH("/invoice-update-orderID/:id/:orderID", invoice.UpdateOrderIDForInvoice)
		r.DELETE("/invoice/:id",invoice.DeleteInvoiceByID)

		// Helppp Routes
		router.GET("/topics", topics.GetTopics)
		router.POST("/create-helpcenterform", helpcenter.CreateHelpCenterFrom)
		router.POST("/response-mailbox", mailbox.ResponseMailBox)
		router.GET("/list-mailboxstatus", helpcenterstatus.ListMailBoxStatus)
		router.GET("/list-mailbox", mailbox.ListMailBox)
		router.GET("/list-article", articles.ListArticles)
		router.POST("/create-article", articles.Createarticles)
		router.PUT("/update-read-status/:id", mailbox.UpdateReadStatus)
		router.POST("/create-review", review.CreateReview)
		router.GET("/list-reviewable-products/:productId", review.ListReviewProducts)
		router.GET("/list-orderitem-noreview/:id", review.ListOrderItemsNoReview)
		router.PUT("/favorite-toggle/:product_id/:review_id/:user_id/:action", review.FavoriteToggle)
		router.GET("/user-reviews/:id", review.ListUserReviews)
		router.GET("/address/:id", address.GetAddress)
		router.PUT("/articles/:id", articles.UpdateArticle)
		router.DELETE("/articles/:id", articles.DeleteArticle)

		//GetShipping
		router.GET("/shipping", shipping.GetShipping)

		router.GET("/transaction", transaction.GetTransactions)
		router.GET("/transaction/:id", transaction.GetTransactionByID)
		router.POST("/transaction", transaction.CreateTransaction)
		router.PUT("/transaction/:id", transaction.UpdateTransactionByID)
		router.DELETE("/transaction/:id", transaction.DeleteTransaction)
		router.POST("/transactions",transaction.CreateTransactionCancel)

		router.GET("/wallet", wallet.GetWallet)
		router.GET("/wallet/:id",wallet.GetWalletByID)
		router.POST("/wallet",wallet.CreateWallet)
		router.PATCH("/wallet/:id",wallet.UpdateWalletByID)
		router.DELETE("/wallet/:id",wallet.DeleteWallet)

		router.GET("/types",address.GatAll)
		router.DELETE("/address/:id",address.DeleteAddress)
		router.GET("/addressByid/:id", address.GetAddressByPayload)
		router.POST("/address", address.CreateAddress)
		router.PUT("/address/:id", address.UpdateAddress)
		router.GET("/notifications", notification.GetNotification)


	}

	r.GET("/", func(c *gin.Context) {

		c.String(http.StatusOK, "API RUNNING...")

	})

	// Run the server

	// r.Run() 
	r.Run("localhost:" + PORT) //ต้องเอาออกตอน deploy

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
