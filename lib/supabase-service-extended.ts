import { supabase, handleSupabaseError } from './supabase';
import type { 
  Card, FinancialPocket, TeamProjectPayment, TeamPaymentRecord, 
  RewardLedgerEntry, Asset, Contract, ClientFeedback, Notification, 
  SocialMediaPost, PromoCode, SOP, Profile 
} from '../types';

// Cards
export const cardsService = {
  async getAll(): Promise<Card[]> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(card => ({
        id: card.id,
        cardHolderName: card.card_holder_name,
        bankName: card.bank_name,
        cardType: card.card_type as any,
        lastFourDigits: card.last_four_digits,
        expiryDate: card.expiry_date || '',
        balance: card.balance,
        colorGradient: card.color_gradient
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(card: Omit<Card, 'id'>): Promise<Card> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert({
          card_holder_name: card.cardHolderName,
          bank_name: card.bankName,
          card_type: card.cardType,
          last_four_digits: card.lastFourDigits,
          expiry_date: card.expiryDate || null,
          balance: card.balance,
          color_gradient: card.colorGradient
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        cardHolderName: data.card_holder_name,
        bankName: data.bank_name,
        cardType: data.card_type as any,
        lastFourDigits: data.last_four_digits,
        expiryDate: data.expiry_date || '',
        balance: data.balance,
        colorGradient: data.color_gradient
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Card>): Promise<Card> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.cardHolderName) updateData.card_holder_name = updates.cardHolderName;
      if (updates.bankName) updateData.bank_name = updates.bankName;
      if (updates.cardType) updateData.card_type = updates.cardType;
      if (updates.lastFourDigits) updateData.last_four_digits = updates.lastFourDigits;
      if (updates.expiryDate !== undefined) updateData.expiry_date = updates.expiryDate || null;
      if (updates.balance !== undefined) updateData.balance = updates.balance;
      if (updates.colorGradient) updateData.color_gradient = updates.colorGradient;

      const { data, error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        cardHolderName: data.card_holder_name,
        bankName: data.bank_name,
        cardType: data.card_type as any,
        lastFourDigits: data.last_four_digits,
        expiryDate: data.expiry_date || '',
        balance: data.balance,
        colorGradient: data.color_gradient
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Financial Pockets
export const pocketsService = {
  async getAll(): Promise<FinancialPocket[]> {
    try {
      const { data, error } = await supabase
        .from('financial_pockets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(pocket => ({
        id: pocket.id,
        name: pocket.name,
        description: pocket.description,
        icon: pocket.icon as any,
        type: pocket.type as any,
        amount: pocket.amount,
        goalAmount: pocket.goal_amount || undefined,
        lockEndDate: pocket.lock_end_date || undefined,
        members: pocket.members as any[],
        sourceCardId: pocket.source_card_id || undefined
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(pocket: Omit<FinancialPocket, 'id'>): Promise<FinancialPocket> {
    try {
      const { data, error } = await supabase
        .from('financial_pockets')
        .insert({
          name: pocket.name,
          description: pocket.description,
          icon: pocket.icon,
          type: pocket.type,
          amount: pocket.amount,
          goal_amount: pocket.goalAmount || null,
          lock_end_date: pocket.lockEndDate || null,
          members: pocket.members || [],
          source_card_id: pocket.sourceCardId || null
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        icon: data.icon as any,
        type: data.type as any,
        amount: data.amount,
        goalAmount: data.goal_amount || undefined,
        lockEndDate: data.lock_end_date || undefined,
        members: data.members as any[],
        sourceCardId: data.source_card_id || undefined
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<FinancialPocket>): Promise<FinancialPocket> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.name) updateData.name = updates.name;
      if (updates.description) updateData.description = updates.description;
      if (updates.icon) updateData.icon = updates.icon;
      if (updates.type) updateData.type = updates.type;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.goalAmount !== undefined) updateData.goal_amount = updates.goalAmount || null;
      if (updates.lockEndDate !== undefined) updateData.lock_end_date = updates.lockEndDate || null;
      if (updates.members !== undefined) updateData.members = updates.members;
      if (updates.sourceCardId !== undefined) updateData.source_card_id = updates.sourceCardId || null;

      const { data, error } = await supabase
        .from('financial_pockets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        icon: data.icon as any,
        type: data.type as any,
        amount: data.amount,
        goalAmount: data.goal_amount || undefined,
        lockEndDate: data.lock_end_date || undefined,
        members: data.members as any[],
        sourceCardId: data.source_card_id || undefined
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_pockets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Assets
export const assetsService = {
  async getAll(): Promise<Asset[]> {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data.map(asset => ({
        id: asset.id,
        name: asset.name,
        category: asset.category,
        purchaseDate: asset.purchase_date,
        purchasePrice: asset.purchase_price,
        serialNumber: asset.serial_number || '',
        status: asset.status as any,
        notes: asset.notes || ''
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(asset: Omit<Asset, 'id'>): Promise<Asset> {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert({
          name: asset.name,
          category: asset.category,
          purchase_date: asset.purchaseDate,
          purchase_price: asset.purchasePrice,
          serial_number: asset.serialNumber || null,
          status: asset.status,
          notes: asset.notes || null
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        purchaseDate: data.purchase_date,
        purchasePrice: data.purchase_price,
        serialNumber: data.serial_number || '',
        status: data.status as any,
        notes: data.notes || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Asset>): Promise<Asset> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.name) updateData.name = updates.name;
      if (updates.category) updateData.category = updates.category;
      if (updates.purchaseDate) updateData.purchase_date = updates.purchaseDate;
      if (updates.purchasePrice !== undefined) updateData.purchase_price = updates.purchasePrice;
      if (updates.serialNumber !== undefined) updateData.serial_number = updates.serialNumber || null;
      if (updates.status) updateData.status = updates.status;
      if (updates.notes !== undefined) updateData.notes = updates.notes || null;

      const { data, error } = await supabase
        .from('assets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        purchaseDate: data.purchase_date,
        purchasePrice: data.purchase_price,
        serialNumber: data.serial_number || '',
        status: data.status as any,
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
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Contracts
export const contractsService = {
  async getAll(): Promise<Contract[]> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(contract => ({
        id: contract.id,
        contractNumber: contract.contract_number,
        clientId: contract.client_id,
        projectId: contract.project_id,
        signingDate: contract.signing_date,
        signingLocation: contract.signing_location,
        clientName1: contract.client_name1,
        clientAddress1: contract.client_address1,
        clientPhone1: contract.client_phone1,
        clientName2: contract.client_name2 || '',
        clientAddress2: contract.client_address2 || '',
        clientPhone2: contract.client_phone2 || '',
        shootingDuration: contract.shooting_duration,
        guaranteedPhotos: contract.guaranteed_photos,
        albumDetails: contract.album_details,
        digitalFilesFormat: contract.digital_files_format,
        otherItems: contract.other_items,
        personnelCount: contract.personnel_count,
        deliveryTimeframe: contract.delivery_timeframe,
        dpDate: contract.dp_date || '',
        finalPaymentDate: contract.final_payment_date || '',
        cancellationPolicy: contract.cancellation_policy,
        jurisdiction: contract.jurisdiction,
        vendorSignature: contract.vendor_signature || '',
        clientSignature: contract.client_signature || '',
        createdAt: contract.created_at
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(contract: Omit<Contract, 'id' | 'createdAt'>): Promise<Contract> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          contract_number: contract.contractNumber,
          client_id: contract.clientId,
          project_id: contract.projectId,
          signing_date: contract.signingDate,
          signing_location: contract.signingLocation,
          client_name1: contract.clientName1,
          client_address1: contract.clientAddress1,
          client_phone1: contract.clientPhone1,
          client_name2: contract.clientName2 || null,
          client_address2: contract.clientAddress2 || null,
          client_phone2: contract.clientPhone2 || null,
          shooting_duration: contract.shootingDuration,
          guaranteed_photos: contract.guaranteedPhotos,
          album_details: contract.albumDetails,
          digital_files_format: contract.digitalFilesFormat,
          other_items: contract.otherItems,
          personnel_count: contract.personnelCount,
          delivery_timeframe: contract.deliveryTimeframe,
          dp_date: contract.dpDate || null,
          final_payment_date: contract.finalPaymentDate || null,
          cancellation_policy: contract.cancellationPolicy,
          jurisdiction: contract.jurisdiction,
          vendor_signature: contract.vendorSignature || null,
          client_signature: contract.clientSignature || null
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        contractNumber: data.contract_number,
        clientId: data.client_id,
        projectId: data.project_id,
        signingDate: data.signing_date,
        signingLocation: data.signing_location,
        clientName1: data.client_name1,
        clientAddress1: data.client_address1,
        clientPhone1: data.client_phone1,
        clientName2: data.client_name2 || '',
        clientAddress2: data.client_address2 || '',
        clientPhone2: data.client_phone2 || '',
        shootingDuration: data.shooting_duration,
        guaranteedPhotos: data.guaranteed_photos,
        albumDetails: data.album_details,
        digitalFilesFormat: data.digital_files_format,
        otherItems: data.other_items,
        personnelCount: data.personnel_count,
        deliveryTimeframe: data.delivery_timeframe,
        dpDate: data.dp_date || '',
        finalPaymentDate: data.final_payment_date || '',
        cancellationPolicy: data.cancellation_policy,
        jurisdiction: data.jurisdiction,
        vendorSignature: data.vendor_signature || '',
        clientSignature: data.client_signature || '',
        createdAt: data.created_at
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Contract>): Promise<Contract> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      
      if (updates.contractNumber) updateData.contract_number = updates.contractNumber;
      if (updates.clientId) updateData.client_id = updates.clientId;
      if (updates.projectId) updateData.project_id = updates.projectId;
      if (updates.signingDate) updateData.signing_date = updates.signingDate;
      if (updates.signingLocation) updateData.signing_location = updates.signingLocation;
      if (updates.clientName1) updateData.client_name1 = updates.clientName1;
      if (updates.clientAddress1) updateData.client_address1 = updates.clientAddress1;
      if (updates.clientPhone1) updateData.client_phone1 = updates.clientPhone1;
      if (updates.clientName2 !== undefined) updateData.client_name2 = updates.clientName2 || null;
      if (updates.clientAddress2 !== undefined) updateData.client_address2 = updates.clientAddress2 || null;
      if (updates.clientPhone2 !== undefined) updateData.client_phone2 = updates.clientPhone2 || null;
      if (updates.shootingDuration) updateData.shooting_duration = updates.shootingDuration;
      if (updates.guaranteedPhotos) updateData.guaranteed_photos = updates.guaranteedPhotos;
      if (updates.albumDetails) updateData.album_details = updates.albumDetails;
      if (updates.digitalFilesFormat) updateData.digital_files_format = updates.digitalFilesFormat;
      if (updates.otherItems) updateData.other_items = updates.otherItems;
      if (updates.personnelCount) updateData.personnel_count = updates.personnelCount;
      if (updates.deliveryTimeframe) updateData.delivery_timeframe = updates.deliveryTimeframe;
      if (updates.dpDate !== undefined) updateData.dp_date = updates.dpDate || null;
      if (updates.finalPaymentDate !== undefined) updateData.final_payment_date = updates.finalPaymentDate || null;
      if (updates.cancellationPolicy) updateData.cancellation_policy = updates.cancellationPolicy;
      if (updates.jurisdiction) updateData.jurisdiction = updates.jurisdiction;
      if (updates.vendorSignature !== undefined) updateData.vendor_signature = updates.vendorSignature || null;
      if (updates.clientSignature !== undefined) updateData.client_signature = updates.clientSignature || null;

      const { data, error } = await supabase
        .from('contracts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        contractNumber: data.contract_number,
        clientId: data.client_id,
        projectId: data.project_id,
        signingDate: data.signing_date,
        signingLocation: data.signing_location,
        clientName1: data.client_name1,
        clientAddress1: data.client_address1,
        clientPhone1: data.client_phone1,
        clientName2: data.client_name2 || '',
        clientAddress2: data.client_address2 || '',
        clientPhone2: data.client_phone2 || '',
        shootingDuration: data.shooting_duration,
        guaranteedPhotos: data.guaranteed_photos,
        albumDetails: data.album_details,
        digitalFilesFormat: data.digital_files_format,
        otherItems: data.other_items,
        personnelCount: data.personnel_count,
        deliveryTimeframe: data.delivery_timeframe,
        dpDate: data.dp_date || '',
        finalPaymentDate: data.final_payment_date || '',
        cancellationPolicy: data.cancellation_policy,
        jurisdiction: data.jurisdiction,
        vendorSignature: data.vendor_signature || '',
        clientSignature: data.client_signature || '',
        createdAt: data.created_at
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Client Feedback
export const feedbackService = {
  async getAll(): Promise<ClientFeedback[]> {
    try {
      const { data, error } = await supabase
        .from('client_feedback')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data.map(feedback => ({
        id: feedback.id,
        clientName: feedback.client_name,
        satisfaction: feedback.satisfaction as any,
        rating: feedback.rating,
        feedback: feedback.feedback,
        date: feedback.date
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(feedback: Omit<ClientFeedback, 'id'>): Promise<ClientFeedback> {
    try {
      const { data, error } = await supabase
        .from('client_feedback')
        .insert({
          client_name: feedback.clientName,
          satisfaction: feedback.satisfaction,
          rating: feedback.rating,
          feedback: feedback.feedback,
          date: feedback.date
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        clientName: data.client_name,
        satisfaction: data.satisfaction as any,
        rating: data.rating,
        feedback: data.feedback,
        date: data.date
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Notifications
export const notificationsService = {
  async getAll(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        timestamp: notification.timestamp,
        isRead: notification.is_read,
        icon: notification.icon as any,
        link: notification.link_view ? {
          view: notification.link_view as any,
          action: notification.link_action as any
        } : undefined
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(notification: Omit<Notification, 'id'>): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: notification.title,
          message: notification.message,
          timestamp: notification.timestamp,
          is_read: notification.isRead,
          icon: notification.icon,
          link_view: notification.link?.view || null,
          link_action: notification.link?.action || {}
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        title: data.title,
        message: data.message,
        timestamp: data.timestamp,
        isRead: data.is_read,
        icon: data.icon as any,
        link: data.link_view ? {
          view: data.link_view as any,
          action: data.link_action as any
        } : undefined
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Social Media Posts
export const socialMediaService = {
  async getAll(): Promise<SocialMediaPost[]> {
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select('*')
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      return data.map(post => ({
        id: post.id,
        projectId: post.project_id,
        clientName: post.client_name,
        postType: post.post_type as any,
        platform: post.platform as any,
        scheduledDate: post.scheduled_date,
        caption: post.caption,
        mediaUrl: post.media_url || '',
        status: post.status as any,
        notes: post.notes || ''
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(post: Omit<SocialMediaPost, 'id'>): Promise<SocialMediaPost> {
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .insert({
          project_id: post.projectId,
          client_name: post.clientName,
          post_type: post.postType,
          platform: post.platform,
          scheduled_date: post.scheduledDate,
          caption: post.caption,
          media_url: post.mediaUrl || null,
          status: post.status,
          notes: post.notes || null
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        projectId: data.project_id,
        clientName: data.client_name,
        postType: data.post_type as any,
        platform: data.platform as any,
        scheduledDate: data.scheduled_date,
        caption: data.caption,
        mediaUrl: data.media_url || '',
        status: data.status as any,
        notes: data.notes || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.projectId) updateData.project_id = updates.projectId;
      if (updates.clientName) updateData.client_name = updates.clientName;
      if (updates.postType) updateData.post_type = updates.postType;
      if (updates.platform) updateData.platform = updates.platform;
      if (updates.scheduledDate) updateData.scheduled_date = updates.scheduledDate;
      if (updates.caption) updateData.caption = updates.caption;
      if (updates.mediaUrl !== undefined) updateData.media_url = updates.mediaUrl || null;
      if (updates.status) updateData.status = updates.status;
      if (updates.notes !== undefined) updateData.notes = updates.notes || null;

      const { data, error } = await supabase
        .from('social_media_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        projectId: data.project_id,
        clientName: data.client_name,
        postType: data.post_type as any,
        platform: data.platform as any,
        scheduledDate: data.scheduled_date,
        caption: data.caption,
        mediaUrl: data.media_url || '',
        status: data.status as any,
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
        .from('social_media_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Promo Codes
export const promoCodesService = {
  async getAll(): Promise<PromoCode[]> {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(code => ({
        id: code.id,
        code: code.code,
        discountType: code.discount_type as any,
        discountValue: code.discount_value,
        isActive: code.is_active,
        usageCount: code.usage_count,
        maxUsage: code.max_usage || undefined,
        expiryDate: code.expiry_date || undefined,
        createdAt: code.created_at
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(code: Omit<PromoCode, 'id' | 'createdAt'>): Promise<PromoCode> {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .insert({
          code: code.code,
          discount_type: code.discountType,
          discount_value: code.discountValue,
          is_active: code.isActive,
          usage_count: code.usageCount,
          max_usage: code.maxUsage || null,
          expiry_date: code.expiryDate || null
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        code: data.code,
        discountType: data.discount_type as any,
        discountValue: data.discount_value,
        isActive: data.is_active,
        usageCount: data.usage_count,
        maxUsage: data.max_usage || undefined,
        expiryDate: data.expiry_date || undefined,
        createdAt: data.created_at
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<PromoCode>): Promise<PromoCode> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.code) updateData.code = updates.code;
      if (updates.discountType) updateData.discount_type = updates.discountType;
      if (updates.discountValue !== undefined) updateData.discount_value = updates.discountValue;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
      if (updates.usageCount !== undefined) updateData.usage_count = updates.usageCount;
      if (updates.maxUsage !== undefined) updateData.max_usage = updates.maxUsage || null;
      if (updates.expiryDate !== undefined) updateData.expiry_date = updates.expiryDate || null;

      const { data, error } = await supabase
        .from('promo_codes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        code: data.code,
        discountType: data.discount_type as any,
        discountValue: data.discount_value,
        isActive: data.is_active,
        usageCount: data.usage_count,
        maxUsage: data.max_usage || undefined,
        expiryDate: data.expiry_date || undefined,
        createdAt: data.created_at
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// SOPs
export const sopsService = {
  async getAll(): Promise<SOP[]> {
    try {
      const { data, error } = await supabase
        .from('sops')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      return data.map(sop => ({
        id: sop.id,
        title: sop.title,
        category: sop.category,
        content: sop.content,
        lastUpdated: sop.last_updated
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  async create(sop: Omit<SOP, 'id'>): Promise<SOP> {
    try {
      const { data, error } = await supabase
        .from('sops')
        .insert({
          title: sop.title,
          category: sop.category,
          content: sop.content,
          last_updated: sop.lastUpdated
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        title: data.title,
        category: data.category,
        content: data.content,
        lastUpdated: data.last_updated
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<SOP>): Promise<SOP> {
    try {
      const updateData: any = { 
        updated_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };
      if (updates.title) updateData.title = updates.title;
      if (updates.category) updateData.category = updates.category;
      if (updates.content) updateData.content = updates.content;

      const { data, error } = await supabase
        .from('sops')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        title: data.title,
        category: data.category,
        content: data.content,
        lastUpdated: data.last_updated
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('sops')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Profile
export const profileService = {
  async get(): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      if (!data) return null;

      return {
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        companyName: data.company_name,
        website: data.website,
        address: data.address,
        bankAccount: data.bank_account,
        authorizedSigner: data.authorized_signer,
        idNumber: data.id_number || '',
        bio: data.bio,
        incomeCategories: data.income_categories as string[],
        expenseCategories: data.expense_categories as string[],
        projectTypes: data.project_types as string[],
        eventTypes: data.event_types as string[],
        assetCategories: data.asset_categories as string[],
        sopCategories: data.sop_categories as string[],
        projectStatusConfig: data.project_status_config as any[],
        notificationSettings: data.notification_settings as any,
        securitySettings: data.security_settings as any,
        briefingTemplate: data.briefing_template,
        termsAndConditions: data.terms_and_conditions || '',
        contractTemplate: data.contract_template || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  },

  async createOrUpdate(profile: Profile): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          full_name: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          company_name: profile.companyName,
          website: profile.website,
          address: profile.address,
          bank_account: profile.bankAccount,
          authorized_signer: profile.authorizedSigner,
          id_number: profile.idNumber || null,
          bio: profile.bio,
          income_categories: profile.incomeCategories,
          expense_categories: profile.expenseCategories,
          project_types: profile.projectTypes,
          event_types: profile.eventTypes,
          asset_categories: profile.assetCategories,
          sop_categories: profile.sopCategories,
          project_status_config: profile.projectStatusConfig,
          notification_settings: profile.notificationSettings,
          security_settings: profile.securitySettings,
          briefing_template: profile.briefingTemplate,
          terms_and_conditions: profile.termsAndConditions || null,
          contract_template: profile.contractTemplate || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return {
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        companyName: data.company_name,
        website: data.website,
        address: data.address,
        bankAccount: data.bank_account,
        authorizedSigner: data.authorized_signer,
        idNumber: data.id_number || '',
        bio: data.bio,
        incomeCategories: data.income_categories as string[],
        expenseCategories: data.expense_categories as string[],
        projectTypes: data.project_types as string[],
        eventTypes: data.event_types as string[],
        assetCategories: data.asset_categories as string[],
        sopCategories: data.sop_categories as string[],
        projectStatusConfig: data.project_status_config as any[],
        notificationSettings: data.notification_settings as any,
        securitySettings: data.security_settings as any,
        briefingTemplate: data.briefing_template,
        termsAndConditions: data.terms_and_conditions || '',
        contractTemplate: data.contract_template || ''
      };
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }
};