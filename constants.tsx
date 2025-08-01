

import { Product, Customer, Supplier, PurchaseOrder, SupplierInvoice, User, Settings, AuditLog, Permission, Role, Quotation, BusinessType } from './types';
import React from 'react';

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cust001', name: 'Walk-in Customer', phone: 'N/A', email: 'walkin@kenpos.co.ke', address: 'N/A', city: 'N/A', dateAdded: new Date('2023-01-01'), loyaltyPoints: 0 },
];

export const MOCK_USERS: User[] = [];

export const MOCK_SUPPLIERS: Supplier[] = [];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [];

export const MOCK_SUPPLIER_INVOICES: SupplierInvoice[] = [];

export const MOCK_QUOTATIONS: Quotation[] = [];

export const MOCK_AUDIT_LOGS: AuditLog[] = [];

export const DEFAULT_SETTINGS: Settings = {
    isSetupComplete: false,
    businessType: 'GeneralRetail',
    businessInfo: {
        name: 'My Biashara Ltd.',
        kraPin: 'P000000000X',
        logoUrl: '',
        location: 'Biashara Street, Nairobi',
        phone: '0712 345 678',
        currency: 'KES',
        language: 'en-US',
    },
    tax: {
        vatEnabled: true,
        vatRate: 16,
        pricingType: 'inclusive',
    },
    discount: {
        enabled: true,
        type: 'percentage',
        maxValue: 10,
    },
    communication: {
        smsProvider: 'Africa\'s Talking',
        smsApiKey: '',
        mailer: 'smtp',
        host: 'smtp.mailtrap.io',
        port: 587,
        username: '',
        password: '',
        encryption: 'tls',
        fromAddress: 'sales@kenpos.co.ke',
        fromName: 'KenPOS Sales',
    },
    receipt: {
        footer: 'Thank you for your business!',
        showQrCode: true,
        invoicePrefix: 'INV-',
        quotePrefix: 'QUO-',
    },
    loyalty: {
        enabled: true,
        pointsPerKsh: 100,
        redemptionRate: 0.5, // 1 point = 0.5 KES
        minRedeemablePoints: 100,
        maxRedemptionPercentage: 50,
    },
    permissions: {
        Admin: ['view_dashboard', 'view_pos', 'view_inventory', 'edit_inventory', 'delete_inventory', 'view_purchases', 'manage_purchases', 'view_ap', 'manage_ap', 'view_tax_reports', 'view_shift_report', 'view_customers', 'manage_customers', 'view_settings', 'view_quotations', 'manage_quotations'],
        Cashier: ['view_pos', 'view_shift_report', 'view_customers'],
        Supervisor: ['view_dashboard', 'view_pos', 'view_inventory', 'edit_inventory', 'view_purchases', 'view_shift_report', 'view_customers', 'manage_customers', 'view_quotations', 'manage_quotations'],
        Accountant: ['view_dashboard', 'view_purchases', 'manage_purchases', 'view_ap', 'manage_ap', 'view_tax_reports', 'view_customers'],
    }
};

export const BUSINESS_TYPES_CONFIG: { [key in BusinessType]: { name: string; description: string; icon: React.ReactNode; } } = {
    GeneralRetail: {
        name: 'General Retail',
        description: 'For kiosks, shops, boutiques, hardware stores, or any business selling physical items.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    },
    Restaurant: {
        name: 'Restaurant / Cafe',
        description: 'For food businesses like restaurants, cafes, pizza shops, and fast-food joints.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    Salon: {
        name: 'Salon / Spa',
        description: 'For service businesses like hair salons, barber shops, nail bars, and spas.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a1 1 0 01-1.414 0L9 12m0 0l2.879-2.879a1 1 0 011.414 0L15 11" /></svg>,
    },
    Services: {
        name: 'Professional Services',
        description: 'For project-based work like tailors, interior designers, consultants, and agencies.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
    }
};

export const PERMISSIONS_CONFIG: { module: string; permissions: { id: Permission; label: string }[] }[] = [
    {
        module: "General",
        permissions: [
            { id: "view_pos", label: "Access POS Screen" },
            { id: "view_dashboard", label: "View Dashboard" },
            { id: "view_shift_report", label: "View Shift Reports" },
        ],
    },
    {
        module: "Inventory & Products",
        permissions: [
            { id: "view_inventory", label: "View Inventory" },
            { id: "edit_inventory", label: "Edit Products" },
            { id: "delete_inventory", label: "Delete Products" },
        ],
    },
    {
        module: "Financial",
        permissions: [
            { id: "view_purchases", label: "View Purchases" },
            { id: "manage_purchases", label: "Manage Purchases (Receive)" },
            { id: "view_ap", label: "View Accounts Payable" },
            { id: "manage_ap", label: "Manage Accounts Payable (Pay)" },
            { id: "view_tax_reports", label: "View Tax Reports" },
        ],
    },
     {
        module: "Sales",
        permissions: [
            { id: "view_quotations", label: "View Quotations" },
            { id: "manage_quotations", label: "Create/Edit Quotations" },
        ],
    },
    {
        module: "Customers",
        permissions: [
            { id: "view_customers", label: "View Customers" },
            { id: "manage_customers", label: "Manage Customers" },
        ],
    },
    {
        module: "Administration",
        permissions: [
            { id: "view_settings", label: "Access System Settings" },
        ],
    },
];


export const ICONS = {
  pos: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  inventory: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
  purchases: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  ap: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  tax: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18m-4.5-9a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm9 9a2.5 2.5 0 110 5 2.5 2.5 0 010-5z" /></svg>,
  shiftReport: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  customers: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  quotations: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  bell: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
};