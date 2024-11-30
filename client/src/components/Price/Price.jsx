import React from 'react'

const Price = ({ price, locale, currency }) => {
    const formatPrice = () =>
        new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
        }).format(price);
  return (
    <>
    <span>{formatPrice()}</span>
    </>
  )
}

export default Price

Price.defaultProps = {
    locale: 'en-US',
    currency: 'INR',
  };