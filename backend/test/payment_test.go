package test

import (
	"github.com/sut67/team17/entity"
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPayment(t *testing.T) {
	t.Run(`UserID is required`, func(t *testing.T) {

		g := NewGomegaWithT(t)

		payment := entity.Payment{
				Amount: 1500,
				// UserID: 1,
				PaymentStatusID: 1,
				// TransactionsID: 2,
				PaymentImage:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0d7b669c4958441da5b437633ebb1732_9366/Campus_00s_JH7275_01_00_standard.jpg",
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run(`Amount is required`, func(t *testing.T) {

		g := NewGomegaWithT(t)

		payment := entity.Payment{
			// Amount: 1500.75,
			UserID: 1,
			
			PaymentStatusID: 1,
			// TransactionsID: 2,
			
			PaymentImage:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0d7b669c4958441da5b437633ebb1732_9366/Campus_00s_JH7275_01_00_standard.jpg",
		}


		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Amount is required"))
	})

	t.Run(`Amount is valid`, func(t *testing.T) {

		g := NewGomegaWithT(t)

		payment := entity.Payment{
			Amount: 1500,
			UserID: 1,
			PaymentStatusID: 1,
			// TransactionsID: 2,
			
			PaymentImage:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0d7b669c4958441da5b437633ebb1732_9366/Campus_00s_JH7275_01_00_standard.jpg",
		}
		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	// t.Run(`Wallet is required`, func(t *testing.T) {

	// 	g := NewGomegaWithT(t)

	// 	payment := entity.Payment{
	// 		Amount: 1500,
	// 		UserID: 101,
	// 		// OrderID: 501,
	// 		PaymentStatusID: 1,
	// 		TransactionsID: 2,
	// 		PaymentImage:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0d7b669c4958441da5b437633ebb1732_9366/Campus_00s_JH7275_01_00_standard.jpg",
	// 	}

	// 	ok, err := govalidator.ValidateStruct(payment)

	// 	g.Expect(ok).NotTo(BeTrue())
	// 	g.Expect(err).NotTo(BeNil())

	// 	g.Expect(err.Error()).To(Equal("OrderID is required"))
	// })

}