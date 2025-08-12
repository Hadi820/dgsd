import { useState, useEffect } from 'react';
import { 
  authService, usersService, clientsService, projectsService, 
  packagesService, addOnsService, teamMembersService, transactionsService, 
  leadsService, profileService 
} from '../lib/supabase-service';
import { 
  cardsService, pocketsService, assetsService, contractsService, 
  feedbackService, notificationsService, socialMediaService, 
  promoCodesService, sopsService 
} from '../lib/supabase-service-extended';
import type { 
  User, Client, Project, Package, AddOn, TeamMember, Transaction, 
  Lead, Card, FinancialPocket, TeamProjectPayment, TeamPaymentRecord, 
  RewardLedgerEntry, Asset, Contract, ClientFeedback, Notification, 
  SocialMediaPost, PromoCode, SOP, Profile 
} from '../types';

export const useSupabaseData = () => {
  // State for all entities
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [pockets, setPockets] = useState<FinancialPocket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clientFeedback, setClientFeedback] = useState<ClientFeedback[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [sops, setSops] = useState<SOP[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Mock data for entities not yet implemented in Supabase
  const [teamProjectPayments, setTeamProjectPayments] = useState<TeamProjectPayment[]>([]);
  const [teamPaymentRecords, setTeamPaymentRecords] = useState<TeamPaymentRecord[]>([]);
  const [rewardLedgerEntries, setRewardLedgerEntries] = useState<RewardLedgerEntry[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        usersData,
        clientsData,
        projectsData,
        packagesData,
        addOnsData,
        teamMembersData,
        transactionsData,
        leadsData,
        cardsData,
        pocketsData,
        assetsData,
        contractsData,
        feedbackData,
        notificationsData,
        socialMediaData,
        promoCodesData,
        sopsData,
        profileData
      ] = await Promise.all([
        usersService.getAll(),
        clientsService.getAll(),
        projectsService.getAll(),
        packagesService.getAll(),
        addOnsService.getAll(),
        teamMembersService.getAll(),
        transactionsService.getAll(),
        leadsService.getAll(),
        cardsService.getAll(),
        pocketsService.getAll(),
        assetsService.getAll(),
        contractsService.getAll(),
        feedbackService.getAll(),
        notificationsService.getAll(),
        socialMediaService.getAll(),
        promoCodesService.getAll(),
        sopsService.getAll(),
        profileService.get()
      ]);

      // Set all data
      setUsers(usersData);
      setClients(clientsData);
      setProjects(projectsData);
      setPackages(packagesData);
      setAddOns(addOnsData);
      setTeamMembers(teamMembersData);
      setTransactions(transactionsData);
      setLeads(leadsData);
      setCards(cardsData);
      setPockets(pocketsData);
      setAssets(assetsData);
      setContracts(contractsData);
      setClientFeedback(feedbackData);
      setNotifications(notificationsData);
      setSocialMediaPosts(socialMediaData);
      setPromoCodes(promoCodesData);
      setSops(sopsData);
      setProfile(profileData);

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from database');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations with optimistic updates
  const createClient = async (client: Omit<Client, 'id'>) => {
    try {
      const newClient = await clientsService.create(client);
      setClients(prev => [newClient, ...prev]);
      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const updatedClient = await clientsService.update(id, updates);
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientsService.delete(id);
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  const createProject = async (project: Omit<Project, 'id'>) => {
    try {
      const newProject = await projectsService.create(project);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await projectsService.update(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await transactionsService.create(transaction);
      setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const updatedTransaction = await transactionsService.update(id, updates);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      return updatedTransaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionsService.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const createLead = async (lead: Omit<Lead, 'id'>) => {
    try {
      const newLead = await leadsService.create(lead);
      setLeads(prev => [newLead, ...prev]);
      return newLead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const updatedLead = await leadsService.update(id, updates);
      setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
      return updatedLead;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await leadsService.delete(id);
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  };

  const createPackage = async (pkg: Omit<Package, 'id'>) => {
    try {
      const newPackage = await packagesService.create(pkg);
      setPackages(prev => [...prev, newPackage]);
      return newPackage;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  };

  const updatePackage = async (id: string, updates: Partial<Package>) => {
    try {
      const updatedPackage = await packagesService.update(id, updates);
      setPackages(prev => prev.map(p => p.id === id ? updatedPackage : p));
      return updatedPackage;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      await packagesService.delete(id);
      setPackages(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  };

  const createAddOn = async (addOn: Omit<AddOn, 'id'>) => {
    try {
      const newAddOn = await addOnsService.create(addOn);
      setAddOns(prev => [...prev, newAddOn]);
      return newAddOn;
    } catch (error) {
      console.error('Error creating add-on:', error);
      throw error;
    }
  };

  const updateAddOn = async (id: string, updates: Partial<AddOn>) => {
    try {
      const updatedAddOn = await addOnsService.update(id, updates);
      setAddOns(prev => prev.map(a => a.id === id ? updatedAddOn : a));
      return updatedAddOn;
    } catch (error) {
      console.error('Error updating add-on:', error);
      throw error;
    }
  };

  const deleteAddOn = async (id: string) => {
    try {
      await addOnsService.delete(id);
      setAddOns(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting add-on:', error);
      throw error;
    }
  };

  const createTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const newMember = await teamMembersService.create(member);
      setTeamMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const updatedMember = await teamMembersService.update(id, updates);
      setTeamMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
      return updatedMember;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      await teamMembersService.delete(id);
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  };

  const createCard = async (card: Omit<Card, 'id'>) => {
    try {
      const newCard = await cardsService.create(card);
      setCards(prev => [...prev, newCard]);
      return newCard;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  };

  const updateCard = async (id: string, updates: Partial<Card>) => {
    try {
      const updatedCard = await cardsService.update(id, updates);
      setCards(prev => prev.map(c => c.id === id ? updatedCard : c));
      return updatedCard;
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await cardsService.delete(id);
      setCards(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  const createAsset = async (asset: Omit<Asset, 'id'>) => {
    try {
      const newAsset = await assetsService.create(asset);
      setAssets(prev => [newAsset, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
      return newAsset;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      const updatedAsset = await assetsService.update(id, updates);
      setAssets(prev => prev.map(a => a.id === id ? updatedAsset : a).sort((a, b) => a.name.localeCompare(b.name)));
      return updatedAsset;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await assetsService.delete(id);
      setAssets(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  };

  const createContract = async (contract: Omit<Contract, 'id' | 'createdAt'>) => {
    try {
      const newContract = await contractsService.create(contract);
      setContracts(prev => [...prev, newContract]);
      return newContract;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  };

  const updateContract = async (id: string, updates: Partial<Contract>) => {
    try {
      const updatedContract = await contractsService.update(id, updates);
      setContracts(prev => prev.map(c => c.id === id ? updatedContract : c));
      return updatedContract;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  };

  const deleteContract = async (id: string) => {
    try {
      await contractsService.delete(id);
      setContracts(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw error;
    }
  };

  const createFeedback = async (feedback: Omit<ClientFeedback, 'id'>) => {
    try {
      const newFeedback = await feedbackService.create(feedback);
      setClientFeedback(prev => [newFeedback, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      return newFeedback;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id'>) => {
    try {
      const newNotification = await notificationsService.create(notification);
      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  const createSocialMediaPost = async (post: Omit<SocialMediaPost, 'id'>) => {
    try {
      const newPost = await socialMediaService.create(post);
      setSocialMediaPosts(prev => [...prev, newPost]);
      return newPost;
    } catch (error) {
      console.error('Error creating social media post:', error);
      throw error;
    }
  };

  const updateSocialMediaPost = async (id: string, updates: Partial<SocialMediaPost>) => {
    try {
      const updatedPost = await socialMediaService.update(id, updates);
      setSocialMediaPosts(prev => prev.map(p => p.id === id ? updatedPost : p));
      return updatedPost;
    } catch (error) {
      console.error('Error updating social media post:', error);
      throw error;
    }
  };

  const deleteSocialMediaPost = async (id: string) => {
    try {
      await socialMediaService.delete(id);
      setSocialMediaPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting social media post:', error);
      throw error;
    }
  };

  const createPromoCode = async (code: Omit<PromoCode, 'id' | 'createdAt'>) => {
    try {
      const newCode = await promoCodesService.create(code);
      setPromoCodes(prev => [...prev, newCode]);
      return newCode;
    } catch (error) {
      console.error('Error creating promo code:', error);
      throw error;
    }
  };

  const updatePromoCode = async (id: string, updates: Partial<PromoCode>) => {
    try {
      const updatedCode = await promoCodesService.update(id, updates);
      setPromoCodes(prev => prev.map(c => c.id === id ? updatedCode : c));
      return updatedCode;
    } catch (error) {
      console.error('Error updating promo code:', error);
      throw error;
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      await promoCodesService.delete(id);
      setPromoCodes(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting promo code:', error);
      throw error;
    }
  };

  const createSOP = async (sop: Omit<SOP, 'id'>) => {
    try {
      const newSOP = await sopsService.create(sop);
      setSops(prev => [...prev, newSOP].sort((a, b) => a.title.localeCompare(b.title)));
      return newSOP;
    } catch (error) {
      console.error('Error creating SOP:', error);
      throw error;
    }
  };

  const updateSOP = async (id: string, updates: Partial<SOP>) => {
    try {
      const updatedSOP = await sopsService.update(id, updates);
      setSops(prev => prev.map(s => s.id === id ? updatedSOP : s));
      return updatedSOP;
    } catch (error) {
      console.error('Error updating SOP:', error);
      throw error;
    }
  };

  const deleteSOP = async (id: string) => {
    try {
      await sopsService.delete(id);
      setSops(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting SOP:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Profile) => {
    try {
      const updatedProfile = await profileService.createOrUpdate(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const createUser = async (user: Omit<User, 'id'>) => {
    try {
      const newUser = await usersService.create(user);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const updatedUser = await usersService.update(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  return {
    // Data
    users, clients, projects, packages, addOns, teamMembers, transactions,
    leads, cards, pockets, teamProjectPayments, teamPaymentRecords,
    rewardLedgerEntries, assets, contracts, clientFeedback, notifications,
    socialMediaPosts, promoCodes, sops, profile,
    
    // State setters (for backward compatibility with existing components)
    setUsers, setClients, setProjects, setPackages, setAddOns, setTeamMembers,
    setTransactions, setLeads, setCards, setPockets, setTeamProjectPayments,
    setTeamPaymentRecords, setRewardLedgerEntries, setAssets, setContracts,
    setClientFeedback, setNotifications, setSocialMediaPosts, setPromoCodes,
    setSops, setProfile,
    
    // CRUD operations
    createClient, updateClient, deleteClient,
    createProject, updateProject, deleteProject,
    createTransaction, updateTransaction, deleteTransaction,
    createLead, updateLead, deleteLead,
    createPackage, updatePackage, deletePackage,
    createAddOn, updateAddOn, deleteAddOn,
    createTeamMember, updateTeamMember, deleteTeamMember,
    createCard, updateCard, deleteCard,
    createAsset, updateAsset, deleteAsset,
    createContract, updateContract, deleteContract,
    createFeedback,
    createNotification, markNotificationAsRead, markAllNotificationsAsRead,
    createSocialMediaPost, updateSocialMediaPost, deleteSocialMediaPost,
    createPromoCode, updatePromoCode, deletePromoCode,
    createSOP, updateSOP, deleteSOP,
    updateProfile,
    createUser, updateUser, deleteUser,
    
    // Auth
    signIn: authService.signIn,
    
    // Loading state
    loading,
    error,
    refetch: loadAllData
  };
};