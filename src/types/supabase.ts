/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/': {
    get: {
      responses: {
        /** OK */
        200: unknown
      }
    }
  }
  '/tasks': {
    get: {
      parameters: {
        query: {
          id?: parameters['rowFilter.tasks.id']
          created_at?: parameters['rowFilter.tasks.created_at']
          updated_at?: parameters['rowFilter.tasks.updated_at']
          uuid?: parameters['rowFilter.tasks.uuid']
          transaction_hash?: parameters['rowFilter.tasks.transaction_hash']
          status?: parameters['rowFilter.tasks.status']
          key_manager?: parameters['rowFilter.tasks.key_manager']
          /** Filtering Columns */
          select?: parameters['select']
          /** Ordering */
          order?: parameters['order']
          /** Limiting and Pagination */
          offset?: parameters['offset']
          /** Limiting and Pagination */
          limit?: parameters['limit']
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range']
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit']
          /** Preference */
          Prefer?: parameters['preferCount']
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions['tasks'][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** tasks */
          tasks?: definitions['tasks']
        }
        query: {
          /** Filtering Columns */
          select?: parameters['select']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          id?: parameters['rowFilter.tasks.id']
          created_at?: parameters['rowFilter.tasks.created_at']
          updated_at?: parameters['rowFilter.tasks.updated_at']
          uuid?: parameters['rowFilter.tasks.uuid']
          transaction_hash?: parameters['rowFilter.tasks.transaction_hash']
          status?: parameters['rowFilter.tasks.status']
          key_manager?: parameters['rowFilter.tasks.key_manager']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          id?: parameters['rowFilter.tasks.id']
          created_at?: parameters['rowFilter.tasks.created_at']
          updated_at?: parameters['rowFilter.tasks.updated_at']
          uuid?: parameters['rowFilter.tasks.uuid']
          transaction_hash?: parameters['rowFilter.tasks.transaction_hash']
          status?: parameters['rowFilter.tasks.status']
          key_manager?: parameters['rowFilter.tasks.key_manager']
        }
        body: {
          /** tasks */
          tasks?: definitions['tasks']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
  '/staked_token': {
    get: {
      parameters: {
        query: {
          id?: parameters['rowFilter.staked_token.id']
          created_at?: parameters['rowFilter.staked_token.created_at']
          updated_at?: parameters['rowFilter.staked_token.updated_at']
          account?: parameters['rowFilter.staked_token.account']
          rewards?: parameters['rowFilter.staked_token.rewards']
          /** Filtering Columns */
          select?: parameters['select']
          /** Ordering */
          order?: parameters['order']
          /** Limiting and Pagination */
          offset?: parameters['offset']
          /** Limiting and Pagination */
          limit?: parameters['limit']
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range']
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit']
          /** Preference */
          Prefer?: parameters['preferCount']
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions['staked_token'][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** staked_token */
          staked_token?: definitions['staked_token']
        }
        query: {
          /** Filtering Columns */
          select?: parameters['select']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          id?: parameters['rowFilter.staked_token.id']
          created_at?: parameters['rowFilter.staked_token.created_at']
          updated_at?: parameters['rowFilter.staked_token.updated_at']
          account?: parameters['rowFilter.staked_token.account']
          rewards?: parameters['rowFilter.staked_token.rewards']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          id?: parameters['rowFilter.staked_token.id']
          created_at?: parameters['rowFilter.staked_token.created_at']
          updated_at?: parameters['rowFilter.staked_token.updated_at']
          account?: parameters['rowFilter.staked_token.account']
          rewards?: parameters['rowFilter.staked_token.rewards']
        }
        body: {
          /** staked_token */
          staked_token?: definitions['staked_token']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
}

export interface definitions {
  tasks: {
    /** Format: bigint */
    id: number
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    created_at: string
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    updated_at?: string
    /** Format: text */
    uuid: string
    /** Format: text */
    transaction_hash: string
    /**
     * Format: public.tasks_status
     * @default unknown
     * @enum {string}
     */
    status: 'unknown' | 'pending' | 'completed' | 'failed'
    /** Format: text */
    key_manager: string
  }
  staked_token: {
    /** Format: bigint */
    id: number
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    created_at: string
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    updated_at?: string
    /** Format: text */
    account: string
    /** Format: text */
    rewards: string
  }
}

export interface parameters {
  /**
   * @description Preference
   * @enum {string}
   */
  preferParams: 'params=single-object'
  /**
   * @description Preference
   * @enum {string}
   */
  preferReturn: 'return=representation' | 'return=minimal' | 'return=none'
  /**
   * @description Preference
   * @enum {string}
   */
  preferCount: 'count=none'
  /** @description Filtering Columns */
  select: string
  /** @description On Conflict */
  on_conflict: string
  /** @description Ordering */
  order: string
  /** @description Limiting and Pagination */
  range: string
  /**
   * @description Limiting and Pagination
   * @default items
   */
  rangeUnit: string
  /** @description Limiting and Pagination */
  offset: string
  /** @description Limiting and Pagination */
  limit: string
  /** @description tasks */
  'body.tasks': definitions['tasks']
  /** Format: bigint */
  'rowFilter.tasks.id': string
  /** Format: timestamp with time zone */
  'rowFilter.tasks.created_at': string
  /** Format: timestamp with time zone */
  'rowFilter.tasks.updated_at': string
  /** Format: text */
  'rowFilter.tasks.uuid': string
  /** Format: text */
  'rowFilter.tasks.transaction_hash': string
  /** Format: public.tasks_status */
  'rowFilter.tasks.status': string
  /** Format: text */
  'rowFilter.tasks.key_manager': string
  /** @description staked_token */
  'body.staked_token': definitions['staked_token']
  /** Format: bigint */
  'rowFilter.staked_token.id': string
  /** Format: timestamp with time zone */
  'rowFilter.staked_token.created_at': string
  /** Format: timestamp with time zone */
  'rowFilter.staked_token.updated_at': string
  /** Format: text */
  'rowFilter.staked_token.account': string
  /** Format: text */
  'rowFilter.staked_token.rewards': string
}