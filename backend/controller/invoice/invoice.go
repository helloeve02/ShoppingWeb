package invoice

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
)

func CreateInvoice(c *gin.Context) {
	var invoice entity.Invoice

	// Bind request to invoice object
	if err := c.ShouldBindJSON(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// Look for the invoice type by ID
	var types entity.InvoiceType
	if err := db.First(&types, invoice.InvoiceTypeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "invoice type not found"})
		return
	}

	// Validate fields if necessary (e.g., checking if they are not empty)
	if invoice.FullName == "" || invoice.Email == "" || invoice.TaxID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing required fields"})
		return
	}

	// Create the new invoice record with the PDF data
	i := entity.Invoice{
		FullName:      invoice.FullName,
		Email:         invoice.Email,
		TaxID:         invoice.TaxID,
		InvoiceTypeID: invoice.InvoiceTypeID,
		OrderID:       invoice.OrderID,
		UserID:        invoice.UserID,
	}

	// Create invoice entry in the database
	if err := db.Create(&i).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Respond with success message
	c.JSON(http.StatusCreated, gin.H{"message": "Invoice created successful!", "invoiceID": i.ID})
}

func GetInvoices(c *gin.Context) {
	var invoice []entity.Invoice

	db := config.DB()
	results := db.Raw(`SELECT * FROM invoices WHERE deleted_at IS NULL`).Scan(&invoice)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, invoice)
}

func UpdateOrderIDForInvoice(c *gin.Context) {
	var invoice entity.Invoice
	invoiceID := c.Param("id")
	orderIDStr := c.Param("orderID")

	// Fetch invoice from DB
	db := config.DB()
	result := db.First(&invoice, invoiceID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice ID not found"})
		return
	}

	OrderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid orderID"})
		return
	}

	// update order id
	invoice.OrderID = uint(OrderID)

	// Save updates to DB
	result = db.Save(&invoice)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Update invoice failed!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Update invoice successful!"})
}

func DeleteInvoiceByID(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var invoice entity.Invoice
	if err := db.First(&invoice, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice ID not found"})
		return
	}

	result := db.Delete(&invoice)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delete invoice failed!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delete invoice successful!"})
}
