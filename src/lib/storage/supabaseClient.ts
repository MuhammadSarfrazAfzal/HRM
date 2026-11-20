import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-hrm.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

export const isSupabaseConfigured = () => {
  return (
    typeof process !== "undefined" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://mock-hrm.supabase.co"
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL Schema DDL ready to run directly in Supabase SQL editor when the user connects their live project:
export const SUPABASE_SQL_SCHEMA = `
-- HRM and Payroll Database Schema for Supabase / PostgreSQL
-- Aligned with HRM and Payroll Build Specification v1.0

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Legal Entity & Org Structure
CREATE TABLE IF NOT EXISTS legal_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL,
    country VARCHAR(64) NOT NULL,
    base_currency VARCHAR(3) NOT NULL DEFAULT 'PKR',
    registration_number VARCHAR(64),
    ntn_number VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES legal_entities(id),
    name VARCHAR(255) NOT NULL,
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Karachi',
    jurisdiction VARCHAR(64) NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    geofence_radius_meters INT DEFAULT 250,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS org_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES legal_entities(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL,
    parent_id UUID REFERENCES org_units(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. People & Employments
CREATE TABLE IF NOT EXISTS people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(64) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    national_id VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(32),
    gender VARCHAR(16),
    date_of_birth DATE,
    emergency_contact_name VARCHAR(128),
    emergency_contact_phone VARCHAR(32),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES legal_entities(id),
    person_id UUID REFERENCES people(id),
    worker_code VARCHAR(32) NOT NULL UNIQUE,
    worker_type VARCHAR(32) NOT NULL DEFAULT 'Full-time',
    hire_date DATE NOT NULL,
    confirmation_date DATE,
    end_date DATE,
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    notice_period_days INT DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employment_id UUID REFERENCES employments(id),
    org_unit_id UUID REFERENCES org_units(id),
    site_id UUID REFERENCES sites(id),
    manager_employment_id UUID REFERENCES employments(id),
    job_title VARCHAR(128) NOT NULL,
    grade_id VARCHAR(32),
    pay_group_id VARCHAR(64) NOT NULL,
    shift_id VARCHAR(64) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL DEFAULT '9999-12-31',
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payout_instructions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employment_id UUID REFERENCES employments(id),
    bank_name VARCHAR(128) NOT NULL,
    account_number_encrypted TEXT NOT NULL,
    account_title VARCHAR(128) NOT NULL,
    iban VARCHAR(64),
    branch_code VARCHAR(16),
    verification_state VARCHAR(32) DEFAULT 'Verified',
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL DEFAULT '9999-12-31',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Payroll Runs & Results
CREATE TABLE IF NOT EXISTS payroll_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_id VARCHAR(64) NOT NULL,
    period_name VARCHAR(128) NOT NULL,
    entity_id UUID REFERENCES legal_entities(id),
    pay_group_id VARCHAR(64) NOT NULL,
    run_type VARCHAR(32) NOT NULL DEFAULT 'Regular',
    state VARCHAR(32) NOT NULL DEFAULT 'Draft',
    currency VARCHAR(3) NOT NULL DEFAULT 'PKR',
    version INT NOT NULL DEFAULT 1,
    employee_count INT NOT NULL DEFAULT 0,
    total_gross NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_withheld NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_net NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_employer_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
    snapshot_hash VARCHAR(128),
    maker_id VARCHAR(64) NOT NULL,
    approver_id VARCHAR(64),
    approval_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID REFERENCES payroll_runs(id),
    employment_id UUID REFERENCES employments(id),
    worker_code VARCHAR(32) NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    contractual_base NUMERIC(14, 2) NOT NULL,
    payable_workdays INT NOT NULL,
    scheduled_workdays INT NOT NULL,
    unpaid_days INT NOT NULL DEFAULT 0,
    overtime_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
    overtime_rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
    gross_earnings NUMERIC(14, 2) NOT NULL,
    withheld_tax NUMERIC(14, 2) NOT NULL DEFAULT 0,
    eobi_employee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    loan_deductions NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_deductions NUMERIC(14, 2) NOT NULL,
    net_payable NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PKR',
    status VARCHAR(32) NOT NULL DEFAULT 'Clean',
    trace_lines_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
`;
