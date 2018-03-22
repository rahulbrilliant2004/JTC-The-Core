export const getAppliedTariffAndValue = (formula) => {

    const equalsToIndex = formula.indexOf('=')
    const asteriskIndex = formula.indexOf('*')
    const hyphenIndex = formula.indexOf('-')
  
    if(equalsToIndex > -1) {
      let value = formula.substring(equalsToIndex + 1, formula.length);
      return ({
        appliedTariff: 'flat',
        tariffValue: parseInt(value.trim())
      })
    }
  
    if((asteriskIndex > -1) && (hyphenIndex > -1)) {
      let parenthesisIndex = formula.indexOf('(')
      let value = formula.substring(parenthesisIndex + 1, asteriskIndex);
      
      return ({
        appliedTariff: 'percentage',
        tariffValue: parseFloat(value.trim()) * 100
      })
    }
  
    if(hyphenIndex > -1) {
      let value = formula.substring(hyphenIndex + 1, formula.length);
      return ({
        appliedTariff: 'amount',
        tariffValue: parseInt(value.trim())
      })
    }
  }
  
  export const appliedTariffData = [
    {
      text: 'Flat Rate',
      value: 'flat',
      tariff: {
        label: 'All Weight'
      } 
    },
    {
      text: 'Discount %',
      value: 'percentage',
      tariff: {
        label: 'Discount Percentage'
      } 
    },
    {
      text: 'Discount Rp',
      value: 'amount',
      tariff: {
        label: 'Discount Rp'
      } 
    }
  ]