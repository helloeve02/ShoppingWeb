package test

import (
	"github.com/sut67/team17/entity"
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestProduct(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`product_name is required`, func(t *testing.T) {
		product := entity.Products{
			ProductsName: "", //ผิดตรงนี้
			Description:     "this product is the most populars",
			Price:           1000,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Product name is required"))
	})

	t.Run(`Product name is valid`, func(t *testing.T) {
		user := entity.Products{
			ProductsName: "shoes",
			Description:     "this product is the most populars",
			Price:           1000,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	t.Run(`Description is required`, func(t *testing.T) {
		product := entity.Products{
			ProductsName: "bag",
			Description:  "", //ผิดตรงนี้
			Price:           1000,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Description is required"))
	})

	t.Run(`Description is valid`, func(t *testing.T) {
		product := entity.Products{
			ProductsName: "bag",
			Description:  "carry bag best for you",
			Price:           1000,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	t.Run(`Price is required`, func(t *testing.T) {
		product := entity.Products{
			ProductsName: "banana",
			Description:  "healthy for you",
			Price:        0, //ผิดตรงนี้
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Price is required"))
	})

	t.Run(`Price is valid`, func(t *testing.T) {
		product := entity.Products{
			ProductsName: "banana",
			Description:  "healthy for you",
			Price:        1000,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	t.Run(`Stock is required`, func(t *testing.T) {
		product := entity.Products{
			ProductsName: "computer",
			Description:  "i9 499999K 1234GB ram",
			Price:        1000,
			Stock:        0, //ผิดตรงนี้
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Stock is required"))
	})

	t.Run(`Stock is valid`, func(t *testing.T) {
		product := entity.Products{
			ProductsName: "computer",
			Description:  "i9 499999K 1234GB ram",
			Price:        1000,
			Stock:        10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
			
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	t.Run(`Product status ID is required`, func(t *testing.T) {
		product := entity.Products{
			ProductsName:    "laptop",
			Description:     "slim laptop",
			Price:           1000,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 0, //ผิดตรงนี้
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Product status is required"))
	})

	t.Run(`Product status ID is valid`, func(t *testing.T) {
		product := entity.Products{
			ProductsName:    "laptop",
			Description:     "slim laptop",
			Price:           1000,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	t.Run(`User ID is required`, func(t *testing.T) {
		product := entity.Products{
			ProductsName:    "laptop",
			Description:     "slim laptop",
			Price:           1000,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          0, //ผิดตรงนี้
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("User is required"))
	})

	t.Run(`User ID is valid`, func(t *testing.T) {
		product := entity.Products{
			ProductsName:    "laptop",
			Description:     "slim laptop",
			Price:           1000,
			Stock:           10,
			BrandID:         1,
			ProductStatusID: 1,
			UserID:          1,
			CategoryID:      1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})
}

func TestProductImage(t *testing.T)  {
	
	g := NewGomegaWithT(t)

	t.Run(`Image is required`, func(t *testing.T) {
		product := entity.ProductImages{
			Image: "",  //ผิดตรงนี้
			ProductID: 1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Image is required"))
	})

	t.Run(`Image is valid`, func(t *testing.T) {
		product := entity.ProductImages{
			Image: "wdasfasfasd7a6sdygausdausydgua6sd8",
			ProductID: 1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	t.Run(`Product ID is required`, func(t *testing.T) {
		product := entity.ProductImages{
			Image: "wdasfasfasd7a6sdygausdausydgua6sd8",
			ProductID: 0, //ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Product ID is required"))
	})

	t.Run(`Product ID is valid`, func(t *testing.T) {
		product := entity.ProductImages{
			Image: "wdasfasfasd7a6sdygausdausydgua6sd8",
			ProductID: 1,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})
}
