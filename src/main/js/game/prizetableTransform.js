define(require => {
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');

    return data => ({
        cells: {
            prizeLevel: data.division,
            prizeValue: SKBeInstant.formatCurrency(data.prize).formattedAmount,
        },
    });
});
