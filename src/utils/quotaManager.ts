export interface QuotaResetInfo {
  lastReset: string;
  nextReset: string;
  shouldReset: boolean;
}

export class QuotaManager {
  /**
   * Check if quota should be reset based on monthly cycle
   */
  static checkQuotaReset(lastResetDate?: string): QuotaResetInfo {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // If no last reset date, assume it's the first time
    if (!lastResetDate) {
      const firstOfMonth = new Date(currentYear, currentMonth, 1);
      const nextMonth = new Date(currentYear, currentMonth + 1, 1);
      
      return {
        lastReset: firstOfMonth.toISOString(),
        nextReset: nextMonth.toISOString(),
        shouldReset: true
      };
    }
    
    const lastReset = new Date(lastResetDate);
    const lastResetMonth = lastReset.getMonth();
    const lastResetYear = lastReset.getFullYear();
    
    // Check if we're in a new month
    const shouldReset = (currentYear > lastResetYear) || 
                       (currentYear === lastResetYear && currentMonth > lastResetMonth);
    
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    
    return {
      lastReset: shouldReset ? new Date(currentYear, currentMonth, 1).toISOString() : lastResetDate,
      nextReset: nextMonth.toISOString(),
      shouldReset
    };
  }
  
  /**
   * Reset user quota if needed
   */
  static resetUserQuotaIfNeeded(user: any): any {
    const quotaInfo = this.checkQuotaReset(user.quota_reset_date || user.quotaResetDate);
    
    if (quotaInfo.shouldReset) {
      return {
        ...user,
        used_quota: 0,
        usedQuota: 0,
        quota_reset_date: quotaInfo.lastReset,
        quotaResetDate: quotaInfo.lastReset,
        next_quota_reset: quotaInfo.nextReset,
        nextQuotaReset: quotaInfo.nextReset
      };
    }
    
    return {
      ...user,
      next_quota_reset: quotaInfo.nextReset,
      nextQuotaReset: quotaInfo.nextReset
    };
  }
  
  /**
   * Get days until next quota reset
   */
  static getDaysUntilReset(nextResetDate?: string): number {
    if (!nextResetDate) {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diffTime = nextMonth.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    const now = new Date();
    const nextReset = new Date(nextResetDate);
    const diffTime = nextReset.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  /**
   * Format next reset date for display
   */
  static formatNextResetDate(nextResetDate?: string): string {
    if (!nextResetDate) {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return nextMonth.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    
    return new Date(nextResetDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}