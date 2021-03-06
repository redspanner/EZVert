import React, { Component } from 'react';
import { View, StatusBar, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';

import { Container } from '../components/Container';
import { Logo } from '../components/Logo';
import { InputWithButton } from '../components/InputWithButton';
import { ClearButton } from '../components/Buttons';
import { LastConverted } from '../components/Text';
import { Header } from '../components/Header';

// REDUX
import { swapCurrency, changeCurrencyAmount, getInitial } from '../actions/currencies';
import { connect } from 'react-redux';

class Home extends Component {

	static propTypes = {
		navigation: PropTypes.object,
		dispatch: PropTypes.func,
		baseCurrency: PropTypes.string,
		quoteCurrency: PropTypes.string,
		amount: PropTypes.number,
		conversionRate: PropTypes.number,
		isFetching: PropTypes.bool,
		lastConvertedDate: PropTypes.object,
		primaryColor: PropTypes.string,
	}

	componentWillMount() {
		this.props.dispatch(getInitial());
	}

	pressBase = () => {
		this.props.navigation.navigate('CurrencyList', { title: 'Base Currency', type: 'base' });
	}

	pressQuote = () => {
		this.props.navigation.navigate('CurrencyList', { title: 'Quote Currency', type: 'quote' });
	}

	handleTextChange = (text) => {
		this.props.dispatch(changeCurrencyAmount(parseFloat(text)));
	}

	handleSwap = () => {
		this.props.dispatch(swapCurrency());
	}

	pressGear = () => {
		this.props.navigation.navigate('Options');
	}

// RENDER ========================

	render() {

		let quotePrice = (this.props.amount * this.props.conversionRate).toFixed(2);
		if (this.props.isFetching) quotePrice = '...';

		return (
			<Container backgroundColor={this.props.primaryColor}>
				<StatusBar translucent={false} barStyle='light-content' />
				<Header
					onPress={this.pressGear}
				/>
				<KeyboardAvoidingView behavior='padding'>
					<Logo

					/>
					<InputWithButton
						buttonText={this.props.baseCurrency}
						onPress={this.pressBase}
						defaultValue={this.props.amount.toString()}
						keyboardType='numeric'
						onChangeText={this.handleTextChange}
						textColor={this.props.primaryColor}
					/>
					<InputWithButton
						buttonText={this.props.quoteCurrency}
						onPress={this.pressQuote}
						defaultValue={quotePrice}
						editable={false}
						textColor={this.props.primaryColor}
					/>
					<LastConverted
						baseCurrency={this.props.baseCurrency}
						quoteCurrency={this.props.quoteCurrency}
						conversionRate={this.props.conversionRate}
						currentDate={this.props.lastConvertedDate}

					/>
					<ClearButton
						text='REVERSE'
						onPress={this.handleSwap}
					/>
				</KeyboardAvoidingView>
			</Container>
		)
	}
}

const mapStateToProps = (state) => {
	const baseCurrency = state.currencies.baseCurrency;
	const quoteCurrency = state.currencies.quoteCurrency;
	const conversionSelector = state.currencies.conversions[baseCurrency] || {};
	const rates = conversionSelector.rates || {};

	return {
		baseCurrency,
		quoteCurrency,
		amount: state.currencies.amount,
		conversionRate: rates[quoteCurrency] || 0,
		isFetching: conversionSelector.isFetching,
		lastConvertedDate: conversionSelector.date ? new Date() : new Date(),
		primaryColor: state.theme.primaryColor,
	}
}

export default connect(mapStateToProps)(Home);
