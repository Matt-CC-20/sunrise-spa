export default {
  computed: {
    currentProduct() {
      return this.product.masterData.staged || this.product.masterData.current;
    },

    hasPrice() {
      return this.matchingVariant.price;
    },
  },

  methods: {
    displayedImageUrl(variant) {
      if (Array.isArray(variant.images) && variant.images.length) {
        return variant.images[0].url;
      }
      return null;
    },

    productRoute(productSlug, sku, productId) {
      let typeName = 'product';
      if (productId === '382fd2b5-2b41-4b10-bbfd-f25da5278de7') {
        typeName = 'bundle';
      }
      return {
        name: typeName,
        params: { productSlug, sku },
      };
    },
  },
};
