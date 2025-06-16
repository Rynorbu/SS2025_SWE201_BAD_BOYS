export class SearchUtils {
    /**
     * Debounce function for search input
     */
    static debounce<T extends (...args: any[]) => any>(
      func: T,
      wait: number
    ): (...args: Parameters<T>) => void {
      let timeout: NodeJS.Timeout
  
      return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
      }
    }
  
    /**
     * Clean search query
     */
    static cleanQuery(query: string): string {
      return query.trim().toLowerCase()
    }
  
    /**
     * Check if query is valid for search
     */
    static isValidQuery(query: string): boolean {
      return query.trim().length >= 2
    }
  }