package test

import (
	"testing"
	. "github.com/onsi/gomega"
	"github.com/asaskevich/govalidator"
	"github.com/sut67/team17/entity"
)

func TestInvoice(t *testing.T) {
	
	g := NewGomegaWithT(t)

	t.Run(`Invoice is valid`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "Peerawich Punyano",
			Email: "New@shoppo.co",
			TaxID: "1212312121000",
			InvoiceTypeID: 1,
			OrderID: 1,
			UserID: 1, 
		}
	
		ok, err := govalidator.ValidateStruct(invoice)
	
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	
	})

	t.Run(`FullName is required`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "", // ผิดตรงนี้
			Email: "New@shoppo.co",
			TaxID: "1212312121000",
			InvoiceTypeID: 1,
			OrderID: 1,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(invoice)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("FullName is required"))
	})

	t.Run(`Email is required`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "Peerawich Punyano",
			Email: "", // ผิดตรงนี้
			TaxID: "1212312121000",
			InvoiceTypeID: 1,
			OrderID: 1,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(invoice)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Email is required"))
	})

	t.Run(`Email is invalid`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "Peerawich Punyano",
			Email: "sdd", // ผิดตรงนี้
			TaxID: "1212312121000",
			InvoiceTypeID: 1,
			OrderID: 1,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(invoice)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Email is invalid"))
	})

	t.Run(`TaxID is required`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "Peerawich Punyano",
			Email: "New@shoppo.co", 
			TaxID: "", // ผิดตรงนี้
			InvoiceTypeID: 1,
			OrderID: 1,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(invoice)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TaxID is required"))
	})

	t.Run(`TaxID less than 13 characters`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "Peerawich Punyano",
			Email: "New@shoppo.co", 
			TaxID: "12699", // ผิดตรงนี้
			InvoiceTypeID: 1,
			OrderID: 1,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(invoice)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TaxID must be 13 characters"))
	})

	t.Run(`TaxID more than 13 characters`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "Peerawich Punyano",
			Email: "New@shoppo.co", 
			TaxID: "12699000110030", // ผิดตรงนี้
			InvoiceTypeID: 1,
			OrderID: 1,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(invoice)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TaxID must be 13 characters"))
	})

	t.Run(`InvoiceType is required`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "Peerawich Punyano",
			Email: "New@shoppo.co", 
			TaxID: "1269900011003", 
			// ผิดตรงนี้
			OrderID: 1,
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(invoice)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("InvoiceType is required"))
	})

	t.Run(`Order is required`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "Peerawich Punyano",
			Email: "New@shoppo.co", 
			TaxID: "1269900011003", 
			InvoiceTypeID: 1,
			// ผิดตรงนี้
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(invoice)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Order is required"))
	})
	t.Run(`User is required`, func(t *testing.T) {
		invoice := entity.Invoice{
			FullName: "Peerawich Punyano",
			Email: "New@shoppo.co", 
			TaxID: "1269900011003", 
			InvoiceTypeID: 1,
			OrderID: 1,
			// ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(invoice)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("User is required"))
	})
}