package test

import (
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut67/team17/entity"
	"testing"
)

func TestName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Name is required`, func(t *testing.T) {
		add := entity.Address{
			Name:          "", // Invalid: Name is required
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12365",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Name is required"))
	})

	t.Run(`Name is valid`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี", // Valid Name
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestAddress(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Address is required`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "", // Invalid: Address is required
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Address is required"))
	})

	t.Run(`Address is valid`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7", // Valid Address
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestSubDistrict(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`SubDistrict is required`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "", // Invalid: SubDistrict is required
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("SubDistrict is required"))
	})

	t.Run(`SubDistrict is valid`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่", // Valid SubDistrict
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestDistrict(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`District is required`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "", // Invalid: District is required
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("District is required"))
	})

	t.Run(`District is valid`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง", // Valid District
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestProvince(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Province is required`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "", // Invalid: Province is required
			PostalCode:    "12345",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Province is required"))
	})

	t.Run(`Province is valid`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา", // Valid Province
			PostalCode:    "12345",
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestPostalCode(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`PostalCode is required`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "", // Invalid: PostalCode is required
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PostalCode is required"))
	})

	t.Run(`PostalCode is valid`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345", // Valid PostalCode
			PhoneNumber:   "0123456789",
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestPhoneNumber(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`PhoneNumber is required`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345",
			PhoneNumber:   "", // Invalid: PhoneNumber is required
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PhoneNumber: non zero value required"))
	})

	t.Run(`PhoneNumber is valid`, func(t *testing.T) {
		add := entity.Address{
			Name:          "ชญาณี",
			Address:       "บ้านเลขที500 หมู่7",
			SubDistrict:   "ตำบลบัวใหญ่",
			District:      "อำเภอเมือง",
			Province:      "จังหวัดนครราชสีมา",
			PostalCode:    "12345",
			PhoneNumber:   "0123456789", // Valid PhoneNumber
			AddressTypeID: 1,
			UserID:        1,
		}

		ok, err := govalidator.ValidateStruct(add)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}