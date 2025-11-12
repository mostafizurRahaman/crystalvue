import { format } from 'date-fns';

/**
 * Formats ISO date strings to a readable format for export
 * @param dateString - ISO date string
 * @param formatString - Date format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string or original value if invalid
 */
export function formatDateForExport(
   dateString: string | null | undefined,
   formatString: string = 'MMM dd, yyyy'
): string {
   if (!dateString) return '';

   try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
         return dateString; // Return original if invalid
      }
      return format(date, formatString);
   } catch (error) {
      console.warn('Error formatting date:', error);
      return dateString; // Return original if error
   }
}

/**
 * Creates a transform function for ProductTableItem data that formats date fields
 * @param dateFormat - Optional custom date format (default: 'MMM dd, yyyy')
 * @returns Transform function for export data
 */
export function createProductDateTransformFunction(dateFormat?: string) {
   return (item: any) => {
      const transformed = { ...item };

      // Format date fields
      if (transformed.createdAt) {
         transformed.createdAt = formatDateForExport(transformed.createdAt, dateFormat);
      }

      if (transformed.updatedAt) {
         transformed.updatedAt = formatDateForExport(transformed.updatedAt, dateFormat);
      }

      if (transformed.approvedAt) {
         transformed.approvedAt = formatDateForExport(transformed.approvedAt, dateFormat);
      }

      return transformed;
   };
}
