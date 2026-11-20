// Pakistan Statutory Tax & Contributions Engine
// References:
// - FBR Income Tax Ordinance 2001, Section 149
// - FBR Tax Year 2027 Withholding Tax Rate Card (Finance Act 2026)
// - Employees' Old-Age Benefits Act 1976 (EOBI)
// - Sindh Employees' Social Security Institution (SESSI) Act 2015

export interface TaxCalculationResult {
  estimatedAnnualTaxableSalary: number;
  annualTax: number;
  monthlyWithholdingTax: number;
  marginalRate: number;
  applicableBracketText: string;
  surcharge: number;
}

export function calculatePakistanSalaryTax(monthlyTaxableIncome: number): TaxCalculationResult {
  const estimatedAnnualTaxableSalary = monthlyTaxableIncome * 12;
  let annualTax = 0;
  let marginalRate = 0;
  let applicableBracketText = "";

  if (estimatedAnnualTaxableSalary <= 600000) {
    annualTax = 0;
    marginalRate = 0;
    applicableBracketText = "Up to PKR 600,000: 0%";
  } else if (estimatedAnnualTaxableSalary <= 1200000) {
    annualTax = (estimatedAnnualTaxableSalary - 600000) * 0.05;
    marginalRate = 0.05;
    applicableBracketText = "PKR 600,001 – 1,200,000: 5% of excess over 600,000";
  } else if (estimatedAnnualTaxableSalary <= 2200000) {
    annualTax = 30000 + (estimatedAnnualTaxableSalary - 1200000) * 0.15;
    marginalRate = 0.15;
    applicableBracketText = "PKR 1,200,001 – 2,200,000: PKR 30,000 + 15% of excess over 1,200,000";
  } else if (estimatedAnnualTaxableSalary <= 3200000) {
    annualTax = 180000 + (estimatedAnnualTaxableSalary - 2200000) * 0.25;
    marginalRate = 0.25;
    applicableBracketText = "PKR 2,200,001 – 3,200,000: PKR 180,000 + 25% of excess over 2,200,000";
  } else if (estimatedAnnualTaxableSalary <= 4100000) {
    annualTax = 430000 + (estimatedAnnualTaxableSalary - 3200000) * 0.30;
    marginalRate = 0.30;
    applicableBracketText = "PKR 3,200,001 – 4,100,000: PKR 430,000 + 30% of excess over 3,200,000";
  } else {
    annualTax = 700000 + (estimatedAnnualTaxableSalary - 4100000) * 0.35;
    marginalRate = 0.35;
    applicableBracketText = "Exceeding PKR 4,100,000: PKR 700,000 + 35% of excess over 4,100,000";
  }

  // Surcharge applicable for high-income earners (> 10M) under Finance Act 2026
  let surcharge = 0;
  if (estimatedAnnualTaxableSalary > 10000000) {
    surcharge = annualTax * 0.10;
    annualTax += surcharge;
  }

  const monthlyWithholdingTax = Math.round((annualTax / 12) * 100) / 100;

  return {
    estimatedAnnualTaxableSalary,
    annualTax: Math.round(annualTax * 100) / 100,
    monthlyWithholdingTax,
    marginalRate,
    applicableBracketText,
    surcharge,
  };
}

// EOBI statutory calculations
export const EOBI_WAGE_BASE = 32000; // Statutory minimum wage base for EOBI
export const EOBI_EMPLOYEE_RATE = 0.01; // 1%
export const EOBI_EMPLOYER_RATE = 0.05; // 5%

export function calculateEOBI(monthlyGross: number) {
  // EOBI is capped at the statutory wage base or applies flatly per standard practice
  const wageBase = Math.min(monthlyGross, EOBI_WAGE_BASE);
  const employeeContribution = Math.round(wageBase * EOBI_EMPLOYEE_RATE);
  const employerLiability = Math.round(wageBase * EOBI_EMPLOYER_RATE);

  return {
    wageBase,
    employeeContribution, // 320 PKR
    employerLiability,    // 1,600 PKR
  };
}

// SESSI (Sindh Employees' Social Security Institution)
export const SESSI_WAGE_CEILING = 37000;
export const SESSI_EMPLOYER_RATE = 0.05; // 5% paid by employer

export function calculateSESSI(monthlyGross: number, isEligible: boolean = true) {
  if (!isEligible || monthlyGross > SESSI_WAGE_CEILING) {
    return {
      wageBase: 0,
      employeeContribution: 0,
      employerLiability: 0,
      isExempt: true,
    };
  }
  const employerLiability = Math.round(monthlyGross * SESSI_EMPLOYER_RATE);
  return {
    wageBase: monthlyGross,
    employeeContribution: 0, // In Sindh, social security is 100% employer liability
    employerLiability,
    isExempt: false,
  };
}

// Statutory Minimum Wage Check
export const STATUTORY_MINIMUM_WAGE_PKR = 37000; // Gazette 2026/2027

export function validateMinimumWageFloor(grossWage: number): { isCompliant: boolean; deficit: number } {
  if (grossWage >= STATUTORY_MINIMUM_WAGE_PKR) {
    return { isCompliant: true, deficit: 0 };
  }
  return { isCompliant: false, deficit: STATUTORY_MINIMUM_WAGE_PKR - grossWage };
}

