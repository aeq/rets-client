/**
 * Count type for Search request
 */
export enum RetsQueryCountType {
  /**
   * Only return record
   */
  OnlyRecord = 0,
  /**
   * Return both record and total count number
   */
  Both = 1,
  /**
   * Only return total count number
   */
  OnlyCountNumber = 2,
}
