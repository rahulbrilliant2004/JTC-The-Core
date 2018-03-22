import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import {
    Icon
} from 'material-ui';
import { getAppliedTariffAndValue, appliedTariffData } from './utils';
import { getEntity } from '../../../actions/entity';

class TariffTooltip extends React.Component {

    state = {
        settingsData: []
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.rowData.id !== this.props.rowData.id) {
            const {
                condition
            } = nextProps.data;
    
            const conditions = condition;
    
            if(conditions.length) {
                getEntity('special_tariff_condition').then(response => {
                    let conditionsFromApi = response.data
                    
                    let conditionPromiseArr = conditions.map(
                        condition => {
                            const selectedCondition = conditionsFromApi.find(
                                conditionWithData => conditionWithData.value == condition.condition
                            )
                            return this.resolveConditionOptions(selectedCondition)
                        }
                    )
            
                    Promise.all(conditionPromiseArr)
                    .then(resolvedConditions => {
            
                        const settingsData = [...resolvedConditions.map(
                            (condition, index) => ({
                                ...condition,
                                selected: conditions[index].condition,
                                selectedValue: isNaN(conditions[index].value_condition) ? 
                                conditions[index].value_condition :
                                parseInt(conditions[index].value_condition)
                            })
                        )]
            
                        this.setState({
                            settingsData
                        })
                    })
                })
              }
        }
    }

    componentDidMount () {

        const {
            condition
        } = this.props.rowData;

        const conditions = condition;

        if(conditions.length) {
            getEntity('special_tariff_condition').then(response => {
                let conditionsFromApi = response.data
                
                let conditionPromiseArr = conditions.map(
                    condition => {
                        const selectedCondition = conditionsFromApi.find(
                            conditionWithData => conditionWithData.value == condition.condition
                        )
                        return this.resolveConditionOptions(selectedCondition)
                    }
                )
        
                Promise.all(conditionPromiseArr)
                .then(resolvedConditions => {
        
                    const settingsData = [...resolvedConditions.map(
                        (condition, index) => ({
                            ...condition,
                            selected: conditions[index].condition,
                            selectedValue: isNaN(conditions[index].value_condition) ? 
                            conditions[index].value_condition :
                            parseInt(conditions[index].value_condition)
                        })
                    )]
        
                    this.setState({
                        settingsData
                    })
                })
            })
          }
    }

    resolveConditionOptions (condition) {
        return new Promise (
            (response, reject) => {
                if(condition && condition.api) {
                    getEntity(condition.api.url)
                        .then(conditionResponse => {
                            const {
                                data
                            } = conditionResponse.data

                            let settingsData = {}

                            settingsData.optionsList = data;
                            settingsData.api = condition.api;
                            settingsData.selectedValue = 0;
                            settingsData.text = condition.text;
                            response(settingsData)
                        })
                } else {
                    let settingsData = {}
                    settingsData.optionsList = undefined;
                    settingsData.api = undefined;
                    settingsData.selectedValue = undefined;
                    settingsData.text = condition.text;
                    response(settingsData)
                }
            }
        )
    }

    render () {
        const {
            id,
            special_tariff_name,
            formula
        } = this.props.rowData

        const {
            settingsData
        } = this.state
    
        const parsedAppliedTariff = getAppliedTariffAndValue(formula)
        const selectedTariff = appliedTariffData.find(
            tariff =>
                tariff.value == parsedAppliedTariff.appliedTariff
        )

        return (
            <div style={styles.container}>
                {this.props.data}
                <a data-tip data-for={`tariffTooltip${id}`}> <Icon style={styles.icon}>info</Icon> </a>
                <ReactTooltip
                    className="tariffTooltip"
                    place="right"
                    effect="float"
                    id={`tariffTooltip${id}`}>
                    <p className="tariffTooltip-tariff-name">{special_tariff_name}</p>
                    <div className="tariffTooltip-info-container">
                        <div className="tariffTooltip-info-child-container">
                            <p>Condition</p>
                            {
                                settingsData.map(
                                    (condition, index) => {
                                        let conditionValue;
                                        let selectedValueText = condition.value_condition || 'Not Found';
                                        if(condition.optionsList && condition.api) {
                                            conditionValue = condition.optionsList.find(option => {
                                                return option[condition.api.dropdown_text] == condition.selectedValue
                                            }) || {}

                                            selectedValueText = conditionValue[condition.api.dropdown_value]
                                        }
 
                                        return (
                                            <p key={index} className="indented">{condition.text}: {
                                                selectedValueText
                                            }</p>
                                        )
                                    }
                                )
                            }
                        </div>
                        {selectedTariff ? <div className="tariffTooltip-info-child-container">
                            <p>Applied Tariff</p>
                            <p className="indented">{selectedTariff.text}:  {parsedAppliedTariff.tariffValue}</p>
                        </div> : null }
                    </div>
                </ReactTooltip>
            </div>
        )
    }
}

const styles = {
    container: {
        display: 'inline',
        paddingLeft: 10
    },
    icon: {
        fontSize: 18
    }
}

export default TariffTooltip;