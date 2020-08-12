import { required, numeric, between } from 'vuelidate/lib/validators';
import cartMixin from '../../../mixins/cartMixin';
import ServerError from '../../common/form/ServerError/index.vue';
import LoadingButton from '../../common/form/LoadingButton/index.vue';
import BaseSelect from '../../common/form/BaseSelect/index.vue';
import BaseForm from '../../common/form/BaseForm/index.vue';
import BaseInput from '../../common/form/BaseInput/index.vue';

const MAX_QUANTITY = 10;
export default {
  props: {
    sku: {
      type: String,
      required: true,
    },
  },
  components: {
    BaseForm,
    BaseSelect,
    BaseInput,
    LoadingButton,
    ServerError,
  },
  mixins: [cartMixin],
  data: () => ({
    form: {
      quantity: 1,
      embroidery: '',
    },
  }),
  computed: {
    isLoading() {
      return this.$apollo.loading;
    },
    quantities() {
      return [...Array(MAX_QUANTITY).keys()].map(i => ({ id: i + 1, name: i + 1 }));
    },
  },
  methods: {
    async addLineItem() {
      if (!this.cartExists) {
        await this.createMyCart({
          currency: this.$store.state.currency,
          country: this.$store.state.country,
          shippingAddress: { country: this.$store.state.country },
        });
      }

      const updateCartAction = {
        addLineItem: {
          custom: {
            typeKey: 'lineitemtype',
            fields: {
              name: 'Embroidery',
              value: `"${this.form.embroidery}"`,
            },
          },
          sku: this.sku,
          quantity: this.form.quantity,
        },
      };

      return this.updateMyCart(updateCartAction).then(() => {
        this.$store.dispatch('openMiniCart');

        if (this.form.embroidery !== '') {
          this.updateMyCart({
            addLineItem: {
              custom: {
                typeKey: 'lineitemtype',
                fields: {
                  name: 'Embroidery',
                  value: `"${this.sku}-${this.form.embroidery}"`,
                },
              },
              sku: 'Embroidery',
              quantity: 1,
            },
          });
        }
      });
    },
  },
  validations() {
    return {
      form: {
        quantity: { required, numeric, between: between(1, MAX_QUANTITY) },
      },
    };
  },
};
