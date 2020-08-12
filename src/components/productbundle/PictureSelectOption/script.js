import gql from 'graphql-tag';

export default {
  props: {
    sku: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    product: null,
  }),
  computed: {
    image() {
      return this.product?.masterData?.current?.variant.images[0].url || '';
    },
    option() {
      return this.product?.masterData?.current?.variant.attributesRaw[0].value.label || 'N/A';
    },
    price() {
      const price = this.product?.masterData?.current?.variant.prices[0].value.centAmount.toString() || '000';
      const priceStr = `${price.substring(0, price.length - 2)}.${price.substring(price.length - 2)}`;
      return priceStr;
    },
  },
  apollo: {
    product: {
      query: gql`
        query VariantSelector( $sku: String!) {
          product(sku: $sku) {
            id
            masterData {
              current {
                allVariants {
                  sku
                }
                variant(sku: $sku) {
                    images{
                      url
                    }
                    attributesRaw {
                      value
                      name
                    }
                    prices{
                      value{
                        centAmount
                        currencyCode
                      }
                    }
                }
              }
            }
          }
        }`,
      variables() {
        return {
          locale: this.$i18n.locale,
          sku: this.sku,
        };
      },
    },
  },
};
