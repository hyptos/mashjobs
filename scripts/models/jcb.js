define([
    'backbone'
], function(Backbone) {
    'use strict';

    var jobModel = Backbone.Model.extend({
        defaults: {
            apiUrl: 'http://api.careerbuilder.com/v1/job',
            api_key: 'WDHS42Z6NVCBC17NTKWY',
            ApplyURL: '',
            ExternalApplication: '',
            BasicJobBranding: '',
            BeginDate: '',
            BlankApplicationServiceURL: '',
            CustomApplyType: '',
            Categories: '',
            CategoriesCodes: '',
            IndustryCodes: '',
            Company: '',
            CompanyDetailsURL: '',
            CompanyDID: '',
            CompanyJobSearchURL: '',
            CompanyImageURL: '',
            ContactInfoEmailURL: '',
            ContactInfoFax: '',
            ContactInfoName: '',
            ContactInfoPhone: '',
            DegreeRequired: '',
            DegreeRequiredCode: '',
            DID: '',
            DisplayJobID: '',
            Division: '',
            EmploymentType: '',
            EmploymentTypeCode: '',
            EndDate: '',
            ExperienceRequired: '',
            ExperienceRequiredCode: '',
            JobDescription: '',
            JobRequirements: '',
            JobTitle: '',
            LocationStreet1: '',
            LocationStreet2: '',
            LocationCity: '',
            LocationCountry: '',
            LocationFormatted: '',
            LocationLatitude: '',
            LocationLongitude: '',
            LocationMetroCity: '',
            LocationPostalCode: '',
            LocationState: '',
            ManagesOthers: '',
            ManagesOthersCode: '',
            ModifiedDate: '',
            ONetCode: '',
            PayHigh: {
                Money: {
                    Amount: '',
                    CurrencyCode: '',
                    FormattedAmount: ''
                }
            },
            PayLow: {
                Money: {
                    Amount: '',
                    CurrencyCode: '',
                    FormattedAmount: ''
                }
            },
            PayPer: '',
            PayHighLowFormatted: '',
            PayCommission: {
                Money: {
                    Amount: '',
                    CurrencyCode: '',
                    FormattedAmount: ''
                }
            },
            PayBonus: {
                Money: {
                    Amount: '',
                    CurrencyCode: '',
                    FormattedAmount: ''
                }
            },
            PayOther: '',
            PrinterFriendlyURL: '',
            RelocationCovered: '',
            TravelRequired: '',
            TravelRequiredCode: '',
            HasQuestionnaire: '',
        }
    });

    return jobModel;
});
