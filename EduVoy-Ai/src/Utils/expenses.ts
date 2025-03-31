export interface expensesType {
    courseFees: {
        tuitionFees: number,
        books: number,
        research: number
    },
    livingExpenses: {
        accommodation: number,
        food: number,
        transport: number,
        utilities: number,
        personal: number
    },
    travelExp: {
        visaFees: number,
        flightCosts: number
    },
    healthExp: {
        healthInsurance: number,
        biometricExp: number,
        tbTestExp: number,
        healthSurcharge: number
    }
}