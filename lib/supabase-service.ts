import { supabase, handleSupabaseError } from './supabase';
import type { 
  User, Client, Project, Package, AddOn, TeamMember, Transaction, 
  Lead, Card, FinancialPocket, TeamProjectPayment, TeamPaymentRecord, 
  RewardLedgerEntry, Asset, Contract, ClientFeedback, Notification, 
  SocialMediaPost, PromoCode, SOP, Profile 
} from '../types';

// Authentication
export const authService = {
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) throw error;
      return data ? {
        id: data.id,
        email: data.email,
        password: data.password,
        fullName: data.full_name,
        role: data.role as 'Admin' | 'Member',
        permissions: data.permissions as any[]
      } : null;
    } catch (error) {
      console.error('Sign in error:', error);
      return null;
    }
  }
};

// Users
export const usersService = {
  async getAll(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(user => ({
        id: user.id,
        email: user.email,
        password: user.password,
        fullName: user.full_name,
        role: user.role as 'Admin' | 'Member',
        permissions: user.permissions as any[]
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: user.email,
          password: user.password,
          full_name: user.fullName,
          role: user.role,
          permissions: user.permissions || []
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        email: data.email,
        password: data.password,
        fullName: data.full_name,
        role: data.role as 'Admin' | 'Member',
        permissions: data.permissions as any[]
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    try {
      const updateData: any = {};
      if (updates.email) updateData.email = updates.email;
      if (updates.password) updateData.password = updates.password;
      if (updates.fullName) updateData.full_name = updates.fullName;
      if (updates.role) updateData.role = updates.role;
      if (updates.permissions !== undefined) updateData.permissions = updates.permissions;
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        email: data.email,
        password: data.password,
        fullName: data.full_name,
        role: data.role as 'Admin' | 'Member',
        permissions: data.permissions as any[]
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Clients
export const clientsService = {
  async getAll(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        instagram: client.instagram || '',
        since: client.since,
        status: client.status as any,
        clientType: client.client_type as any,
        lastContact: client.last_contact,
        portalAccessId: client.portal_access_id
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(client: Omit<Client, 'id'>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: client.name,
          email: client.email,
          phone: client.phone,
          instagram: client.instagram,
          since: client.since,
          status: client.status,
          client_type: client.clientType,
          last_contact: client.lastContact,
          portal_access_id: client.portalAccessId
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        instagram: data.instagram || '',
        since: data.since,
        status: data.status as any,
        clientType: data.client_type as any,
        lastContact: data.last_contact,
        portalAccessId: data.portal_access_id
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.name) updateData.name = updates.name;
      if (updates.email) updateData.email = updates.email;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.instagram !== undefined) updateData.instagram = updates.instagram;
      if (updates.since) updateData.since = updates.since;
      if (updates.status) updateData.status = updates.status;
      if (updates.clientType) updateData.client_type = updates.clientType;
      if (updates.lastContact) updateData.last_contact = updates.lastContact;
      if (updates.portalAccessId) updateData.portal_access_id = updates.portalAccessId;

      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        instagram: data.instagram || '',
        since: data.since,
        status: data.status as any,
        clientType: data.client_type as any,
        lastContact: data.last_contact,
        portalAccessId: data.portal_access_id
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Projects
export const projectsService = {
  async getAll(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(project => ({
        id: project.id,
        projectName: project.project_name,
        clientId: project.client_id,
        clientName: project.client_name,
        projectType: project.project_type,
        packageId: project.package_id,
        packageName: project.package_name,
        addOns: project.add_ons as any[],
        date: project.date,
        deadlineDate: project.deadline_date || '',
        location: project.location,
        progress: project.progress,
        status: project.status,
        activeSubStatuses: project.active_sub_statuses as string[],
        totalCost: project.total_cost,
        amountPaid: project.amount_paid,
        paymentStatus: project.payment_status as any,
        team: project.team as any[],
        notes: project.notes || '',
        accommodation: project.accommodation || '',
        driveLink: project.drive_link || '',
        clientDriveLink: project.client_drive_link || '',
        finalDriveLink: project.final_drive_link || '',
        startTime: project.start_time || '',
        endTime: project.end_time || '',
        image: project.image || '',
        revisions: project.revisions as any[],
        promoCodeId: project.promo_code_id || '',
        discountAmount: project.discount_amount || 0,
        shippingDetails: project.shipping_details || '',
        dpProofUrl: project.dp_proof_url || '',
        printingDetails: project.printing_details as any[],
        printingCost: project.printing_cost,
        transportCost: project.transport_cost,
        isEditingConfirmedByClient: project.is_editing_confirmed_by_client,
        isPrintingConfirmedByClient: project.is_printing_confirmed_by_client,
        isDeliveryConfirmedByClient: project.is_delivery_confirmed_by_client,
        confirmedSubStatuses: project.confirmed_sub_statuses as string[],
        clientSubStatusNotes: project.client_sub_status_notes as Record<string, string>,
        subStatusConfirmationSentAt: project.sub_status_confirmation_sent_at as Record<string, string>,
        completedDigitalItems: project.completed_digital_items as string[],
        invoiceSignature: project.invoice_signature || ''
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          project_name: project.projectName,
          client_id: project.clientId,
          client_name: project.clientName,
          project_type: project.projectType,
          package_id: project.packageId,
          package_name: project.packageName,
          add_ons: project.addOns,
          date: project.date,
          deadline_date: project.deadlineDate || null,
          location: project.location,
          progress: project.progress,
          status: project.status,
          active_sub_statuses: project.activeSubStatuses || [],
          total_cost: project.totalCost,
          amount_paid: project.amountPaid,
          payment_status: project.paymentStatus,
          team: project.team,
          notes: project.notes,
          accommodation: project.accommodation,
          drive_link: project.driveLink,
          client_drive_link: project.clientDriveLink,
          final_drive_link: project.finalDriveLink,
          start_time: project.startTime,
          end_time: project.endTime,
          image: project.image,
          revisions: project.revisions || [],
          promo_code_id: project.promoCodeId || null,
          discount_amount: project.discountAmount,
          shipping_details: project.shippingDetails,
          dp_proof_url: project.dpProofUrl,
          printing_details: project.printingDetails || [],
          printing_cost: project.printingCost || 0,
          transport_cost: project.transportCost || 0,
          is_editing_confirmed_by_client: project.isEditingConfirmedByClient || false,
          is_printing_confirmed_by_client: project.isPrintingConfirmedByClient || false,
          is_delivery_confirmed_by_client: project.isDeliveryConfirmedByClient || false,
          confirmed_sub_statuses: project.confirmedSubStatuses || [],
          client_sub_status_notes: project.clientSubStatusNotes || {},
          sub_status_confirmation_sent_at: project.subStatusConfirmationSentAt || {},
          completed_digital_items: project.completedDigitalItems || [],
          invoice_signature: project.invoiceSignature
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapDbToProject(data);
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      
      if (updates.projectName) updateData.project_name = updates.projectName;
      if (updates.clientId) updateData.client_id = updates.clientId;
      if (updates.clientName) updateData.client_name = updates.clientName;
      if (updates.projectType) updateData.project_type = updates.projectType;
      if (updates.packageId) updateData.package_id = updates.packageId;
      if (updates.packageName) updateData.package_name = updates.packageName;
      if (updates.addOns !== undefined) updateData.add_ons = updates.addOns;
      if (updates.date) updateData.date = updates.date;
      if (updates.deadlineDate !== undefined) updateData.deadline_date = updates.deadlineDate || null;
      if (updates.location) updateData.location = updates.location;
      if (updates.progress !== undefined) updateData.progress = updates.progress;
      if (updates.status) updateData.status = updates.status;
      if (updates.activeSubStatuses !== undefined) updateData.active_sub_statuses = updates.activeSubStatuses;
      if (updates.totalCost !== undefined) updateData.total_cost = updates.totalCost;
      if (updates.amountPaid !== undefined) updateData.amount_paid = updates.amountPaid;
      if (updates.paymentStatus) updateData.payment_status = updates.paymentStatus;
      if (updates.team !== undefined) updateData.team = updates.team;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.accommodation !== undefined) updateData.accommodation = updates.accommodation;
      if (updates.driveLink !== undefined) updateData.drive_link = updates.driveLink;
      if (updates.clientDriveLink !== undefined) updateData.client_drive_link = updates.clientDriveLink;
      if (updates.finalDriveLink !== undefined) updateData.final_drive_link = updates.finalDriveLink;
      if (updates.startTime !== undefined) updateData.start_time = updates.startTime;
      if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.revisions !== undefined) updateData.revisions = updates.revisions;
      if (updates.promoCodeId !== undefined) updateData.promo_code_id = updates.promoCodeId;
      if (updates.discountAmount !== undefined) updateData.discount_amount = updates.discountAmount;
      if (updates.shippingDetails !== undefined) updateData.shipping_details = updates.shippingDetails;
      if (updates.dpProofUrl !== undefined) updateData.dp_proof_url = updates.dpProofUrl;
      if (updates.printingDetails !== undefined) updateData.printing_details = updates.printingDetails;
      if (updates.printingCost !== undefined) updateData.printing_cost = updates.printingCost;
      if (updates.transportCost !== undefined) updateData.transport_cost = updates.transportCost;
      if (updates.isEditingConfirmedByClient !== undefined) updateData.is_editing_confirmed_by_client = updates.isEditingConfirmedByClient;
      if (updates.isPrintingConfirmedByClient !== undefined) updateData.is_printing_confirmed_by_client = updates.isPrintingConfirmedByClient;
      if (updates.isDeliveryConfirmedByClient !== undefined) updateData.is_delivery_confirmed_by_client = updates.isDeliveryConfirmedByClient;
      if (updates.confirmedSubStatuses !== undefined) updateData.confirmed_sub_statuses = updates.confirmedSubStatuses;
      if (updates.clientSubStatusNotes !== undefined) updateData.client_sub_status_notes = updates.clientSubStatusNotes;
      if (updates.subStatusConfirmationSentAt !== undefined) updateData.sub_status_confirmation_sent_at = updates.subStatusConfirmationSentAt;
      if (updates.completedDigitalItems !== undefined) updateData.completed_digital_items = updates.completedDigitalItems;
      if (updates.invoiceSignature !== undefined) updateData.invoice_signature = updates.invoiceSignature;

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapDbToProject(data);
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  mapDbToProject(data: any): Project {
    return {
      id: data.id,
      projectName: data.project_name,
      clientId: data.client_id,
      clientName: data.client_name,
      projectType: data.project_type,
      packageId: data.package_id,
      packageName: data.package_name,
      addOns: data.add_ons as any[],
      date: data.date,
      deadlineDate: data.deadline_date || '',
      location: data.location,
      progress: data.progress,
      status: data.status,
      activeSubStatuses: data.active_sub_statuses as string[],
      totalCost: data.total_cost,
      amountPaid: data.amount_paid,
      paymentStatus: data.payment_status as any,
      team: data.team as any[],
      notes: data.notes || '',
      accommodation: data.accommodation || '',
      driveLink: data.drive_link || '',
      clientDriveLink: data.client_drive_link || '',
      finalDriveLink: data.final_drive_link || '',
      startTime: data.start_time || '',
      endTime: data.end_time || '',
      image: data.image || '',
      revisions: data.revisions as any[],
      promoCodeId: data.promo_code_id || '',
      discountAmount: data.discount_amount || 0,
      shippingDetails: data.shipping_details || '',
      dpProofUrl: data.dp_proof_url || '',
      printingDetails: data.printing_details as any[],
      printingCost: data.printing_cost,
      transportCost: data.transport_cost,
      isEditingConfirmedByClient: data.is_editing_confirmed_by_client,
      isPrintingConfirmedByClient: data.is_printing_confirmed_by_client,
      isDeliveryConfirmedByClient: data.is_delivery_confirmed_by_client,
      confirmedSubStatuses: data.confirmed_sub_statuses as string[],
      clientSubStatusNotes: data.client_sub_status_notes as Record<string, string>,
      subStatusConfirmationSentAt: data.sub_status_confirmation_sent_at as Record<string, string>,
      completedDigitalItems: data.completed_digital_items as string[],
      invoiceSignature: data.invoice_signature || ''
    };
  }
};

// Packages
export const packagesService = {
  async getAll(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        physicalItems: pkg.physical_items as any[],
        digitalItems: pkg.digital_items as string[],
        processingTime: pkg.processing_time,
        photographers: pkg.photographers || '',
        videographers: pkg.videographers || ''
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(pkg: Omit<Package, 'id'>): Promise<Package> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert({
          name: pkg.name,
          price: pkg.price,
          physical_items: pkg.physicalItems,
          digital_items: pkg.digitalItems,
          processing_time: pkg.processingTime,
          photographers: pkg.photographers,
          videographers: pkg.videographers
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        physicalItems: data.physical_items as any[],
        digitalItems: data.digital_items as string[],
        processingTime: data.processing_time,
        photographers: data.photographers || '',
        videographers: data.videographers || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Package>): Promise<Package> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.name) updateData.name = updates.name;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.physicalItems !== undefined) updateData.physical_items = updates.physicalItems;
      if (updates.digitalItems !== undefined) updateData.digital_items = updates.digitalItems;
      if (updates.processingTime) updateData.processing_time = updates.processingTime;
      if (updates.photographers !== undefined) updateData.photographers = updates.photographers;
      if (updates.videographers !== undefined) updateData.videographers = updates.videographers;

      const { data, error } = await supabase
        .from('packages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        physicalItems: data.physical_items as any[],
        digitalItems: data.digital_items as string[],
        processingTime: data.processing_time,
        photographers: data.photographers || '',
        videographers: data.videographers || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Add-ons
export const addOnsService = {
  async getAll(): Promise<AddOn[]> {
    try {
      const { data, error } = await supabase
        .from('add_ons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(addon => ({
        id: addon.id,
        name: addon.name,
        price: addon.price
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(addon: Omit<AddOn, 'id'>): Promise<AddOn> {
    try {
      const { data, error } = await supabase
        .from('add_ons')
        .insert({
          name: addon.name,
          price: addon.price
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        price: data.price
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<AddOn>): Promise<AddOn> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.name) updateData.name = updates.name;
      if (updates.price !== undefined) updateData.price = updates.price;

      const { data, error } = await supabase
        .from('add_ons')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        price: data.price
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('add_ons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Team Members
export const teamMembersService = {
  async getAll(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        email: member.email,
        phone: member.phone,
        standardFee: member.standard_fee,
        noRek: member.no_rek || '',
        rewardBalance: member.reward_balance,
        rating: member.rating,
        performanceNotes: member.performance_notes as any[],
        portalAccessId: member.portal_access_id
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          name: member.name,
          role: member.role,
          email: member.email,
          phone: member.phone,
          standard_fee: member.standardFee,
          no_rek: member.noRek,
          reward_balance: member.rewardBalance,
          rating: member.rating,
          performance_notes: member.performanceNotes,
          portal_access_id: member.portalAccessId
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        role: data.role,
        email: data.email,
        phone: data.phone,
        standardFee: data.standard_fee,
        noRek: data.no_rek || '',
        rewardBalance: data.reward_balance,
        rating: data.rating,
        performanceNotes: data.performance_notes as any[],
        portalAccessId: data.portal_access_id
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.name) updateData.name = updates.name;
      if (updates.role) updateData.role = updates.role;
      if (updates.email) updateData.email = updates.email;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.standardFee !== undefined) updateData.standard_fee = updates.standardFee;
      if (updates.noRek !== undefined) updateData.no_rek = updates.noRek;
      if (updates.rewardBalance !== undefined) updateData.reward_balance = updates.rewardBalance;
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.performanceNotes !== undefined) updateData.performance_notes = updates.performanceNotes;
      if (updates.portalAccessId) updateData.portal_access_id = updates.portalAccessId;

      const { data, error } = await supabase
        .from('team_members')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        role: data.role,
        email: data.email,
        phone: data.phone,
        standardFee: data.standard_fee,
        noRek: data.no_rek || '',
        rewardBalance: data.reward_balance,
        rating: data.rating,
        performanceNotes: data.performance_notes as any[],
        portalAccessId: data.portal_access_id
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Transactions
export const transactionsService = {
  async getAll(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data.map(transaction => ({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type as any,
        projectId: transaction.project_id || '',
        category: transaction.category,
        method: transaction.method as any,
        pocketId: transaction.pocket_id || '',
        cardId: transaction.card_id || '',
        printingItemId: transaction.printing_item_id || '',
        vendorSignature: transaction.vendor_signature || ''
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          date: transaction.date,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          project_id: transaction.projectId || null,
          category: transaction.category,
          method: transaction.method,
          pocket_id: transaction.pocketId || null,
          card_id: transaction.cardId || null,
          printing_item_id: transaction.printingItemId || null,
          vendor_signature: transaction.vendorSignature || null
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        date: data.date,
        description: data.description,
        amount: data.amount,
        type: data.type as any,
        projectId: data.project_id || '',
        category: data.category,
        method: data.method as any,
        pocketId: data.pocket_id || '',
        cardId: data.card_id || '',
        printingItemId: data.printing_item_id || '',
        vendorSignature: data.vendor_signature || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.date) updateData.date = updates.date;
      if (updates.description) updateData.description = updates.description;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.type) updateData.type = updates.type;
      if (updates.projectId !== undefined) updateData.project_id = updates.projectId || null;
      if (updates.category) updateData.category = updates.category;
      if (updates.method) updateData.method = updates.method;
      if (updates.pocketId !== undefined) updateData.pocket_id = updates.pocketId || null;
      if (updates.cardId !== undefined) updateData.card_id = updates.cardId || null;
      if (updates.printingItemId !== undefined) updateData.printing_item_id = updates.printingItemId || null;
      if (updates.vendorSignature !== undefined) updateData.vendor_signature = updates.vendorSignature || null;

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        date: data.date,
        description: data.description,
        amount: data.amount,
        type: data.type as any,
        projectId: data.project_id || '',
        category: data.category,
        method: data.method as any,
        pocketId: data.pocket_id || '',
        cardId: data.card_id || '',
        printingItemId: data.printing_item_id || '',
        vendorSignature: data.vendor_signature || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Leads
export const leadsService = {
  async getAll(): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(lead => ({
        id: lead.id,
        name: lead.name,
        contactChannel: lead.contact_channel as any,
        location: lead.location,
        status: lead.status as any,
        date: lead.date,
        notes: lead.notes || ''
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(lead: Omit<Lead, 'id'>): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: lead.name,
          contact_channel: lead.contactChannel,
          location: lead.location,
          status: lead.status,
          date: lead.date,
          notes: lead.notes
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        contactChannel: data.contact_channel as any,
        location: data.location,
        status: data.status as any,
        date: data.date,
        notes: data.notes || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Lead>): Promise<Lead> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.name) updateData.name = updates.name;
      if (updates.contactChannel) updateData.contact_channel = updates.contactChannel;
      if (updates.location) updateData.location = updates.location;
      if (updates.status) updateData.status = updates.status;
      if (updates.date) updateData.date = updates.date;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        contactChannel: data.contact_channel as any,
        location: data.location,
        status: data.status as any,
        date: data.date,
        notes: data.notes || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Similar services for other entities...
// I'll create the remaining services in the next part due to length constraints