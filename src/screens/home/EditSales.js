import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { InputText, InputSelect, InputButton, SuccessModal, InputError } from '../../component';
import {
  updateEditProductEntryProps,
  editProductEntry,
  deleteProductEntry,
  fetchFilterClientsList,
  EDIT_PRODUCT_ENTRY_ERROR,
  validate,
} from '../../actions';

class EditProductEntry extends Component {
  state = {
    success: false,
    openMore: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      delete: this.delete.bind(this),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product_id !== this.props.product_id) {
      this.resolveProductType();
    }
  }

  delete() {
    const { id } = this.props;
    this.props.deleteProductEntry(id);
  }

  resolveData(data) {
    const obj = { 0: 'Select product' };
    if (data && data.length > 0) {
      _.map(data, v => Object.assign(obj, { [v.id]: v.name }));
    }
    return obj;
  }

  resolveProductType() {
    const obj = { 0: 'Select product type' };
    const { products, product_id } = this.props;
    if (product_id && product_id != '0') {
      _.map(_.find(products, v => v.id == product_id).type, v =>
        Object.assign(obj, { [v.id]: v.name })
      );
    }
    return obj;
  }

  onSuccessPress() {
    this.props.updateEditProductEntryProps('success', false);
    this.props.fetchFilterClientsList();
    this.props.navigation.goBack();
  }

  onSubmit() {
    const rule = {
      qty: ['required', 'qty'],
      product_id: 'required',
      product_type_id: 'reqruired',
      amount: ['required', 'amount'],
    };
    this.props
      .validate(this.props, rule, EDIT_PRODUCT_ENTRY_ERROR)
      .then(() => this.props.editProductEntry(this.props));
  }

  render() {
    const { containerStyle } = styles;
    const {
      qty,
      success,
      error,
      errorMessage,
      message,
      product_id,
      product_type_id,
      amount,
      remark,
      id,
      loading,
    } = this.props;
    return (
      <View style={containerStyle}>
        <ScrollView>
          <InputSelect
            label="Product"
            selectedValue={product_id && product_id.toString()}
            data={this.resolveData(this.props.products)}
            error={'product_id' in error}
            errorText={'product_id' in error && error.product_id[0]}
            onValueChange={value => this.props.updateEditProductEntryProps('product_id', value)}
          />
          <InputSelect
            label="Product Type"
            selectedValue={product_type_id && product_type_id.toString()}
            data={this.resolveProductType()}
            error={'product_type_id' in error}
            errorText={'product_type_id' in error && error.product_type_id[0]}
            onValueChange={value =>
              this.props.updateEditProductEntryProps('product_type_id', value)
            }
          />
          <InputText
            label="Qty"
            value={qty}
            error={'qty' in error}
            errorText={'qty' in error && error.qty[0]}
            onChangeText={value => this.props.updateEditProductEntryProps('qty', value)}
            keyboardType="numeric"
          />
          <InputText
            error={'amount' in error}
            errorText={'amount' in error && error.amount[0]}
            label="Amount"
            value={amount}
            onChangeText={value => this.props.updateEditProductEntryProps('amount', value)}
            keyboardType="numeric"
          />
          <InputText
            error={'remark' in error}
            errorText={'remark' in error && error.remark[0]}
            label="Remark"
            value={remark}
            onChangeText={value => this.props.updateEditProductEntryProps('remark', value)}
          />
          <InputError
            visible={Object.keys(error) < 1 && errorMessage}
            errorText={errorMessage && errorMessage}
          />
        </ScrollView>
        <View>
          <InputButton title="Save Changes" onPress={() => this.onSubmit()} loading={loading} />
        </View>
        <SuccessModal visible={success} onPress={() => this.onSuccessPress()} text={message} />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const mapStateToProps = state => {
  const {
    qty,
    success,
    error,
    errorMessage,
    message,
    product_id,
    product_type_id,
    amount,
    remark,
    loading,
    id,
  } = state.editProductEntry;
  const { data: products } = state.fetchProduct;

  return {
    qty,
    success,
    error,
    errorMessage,
    message,
    product_id,
    product_type_id,
    amount,
    remark,
    id,
    loading,
    products,
  };
};

export default connect(
  mapStateToProps,
  {
    editProductEntry,
    updateEditProductEntryProps,
    deleteProductEntry,
    fetchFilterClientsList,
    validate,
  }
)(EditProductEntry);
