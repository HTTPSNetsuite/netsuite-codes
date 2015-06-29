<?php

namespace Base;

use \PurchaseOrder as ChildPurchaseOrder;
use \PurchaseOrderQuery as ChildPurchaseOrderQuery;
use \Exception;
use \PDO;
use Map\PurchaseOrderTableMap;
use Propel\Runtime\Propel;
use Propel\Runtime\ActiveQuery\Criteria;
use Propel\Runtime\ActiveQuery\ModelCriteria;
use Propel\Runtime\Collection\ObjectCollection;
use Propel\Runtime\Connection\ConnectionInterface;
use Propel\Runtime\Exception\PropelException;

/**
 * Base class that represents a query for the 'purchase_order' table.
 *
 *
 *
 * @method     ChildPurchaseOrderQuery orderById($order = Criteria::ASC) Order by the id column
 * @method     ChildPurchaseOrderQuery orderByFilename($order = Criteria::ASC) Order by the filename column
 * @method     ChildPurchaseOrderQuery orderByStore($order = Criteria::ASC) Order by the store column
 * @method     ChildPurchaseOrderQuery orderByIsSync($order = Criteria::ASC) Order by the is_sync column
 * @method     ChildPurchaseOrderQuery orderByCustomerCode($order = Criteria::ASC) Order by the customer_code column
 * @method     ChildPurchaseOrderQuery orderByDeliveryDate($order = Criteria::ASC) Order by the delivery_date column
 * @method     ChildPurchaseOrderQuery orderByNumber($order = Criteria::ASC) Order by the number column
 *
 * @method     ChildPurchaseOrderQuery groupById() Group by the id column
 * @method     ChildPurchaseOrderQuery groupByFilename() Group by the filename column
 * @method     ChildPurchaseOrderQuery groupByStore() Group by the store column
 * @method     ChildPurchaseOrderQuery groupByIsSync() Group by the is_sync column
 * @method     ChildPurchaseOrderQuery groupByCustomerCode() Group by the customer_code column
 * @method     ChildPurchaseOrderQuery groupByDeliveryDate() Group by the delivery_date column
 * @method     ChildPurchaseOrderQuery groupByNumber() Group by the number column
 *
 * @method     ChildPurchaseOrderQuery leftJoin($relation) Adds a LEFT JOIN clause to the query
 * @method     ChildPurchaseOrderQuery rightJoin($relation) Adds a RIGHT JOIN clause to the query
 * @method     ChildPurchaseOrderQuery innerJoin($relation) Adds a INNER JOIN clause to the query
 *
 * @method     ChildPurchaseOrder findOne(ConnectionInterface $con = null) Return the first ChildPurchaseOrder matching the query
 * @method     ChildPurchaseOrder findOneOrCreate(ConnectionInterface $con = null) Return the first ChildPurchaseOrder matching the query, or a new ChildPurchaseOrder object populated from the query conditions when no match is found
 *
 * @method     ChildPurchaseOrder findOneById(int $id) Return the first ChildPurchaseOrder filtered by the id column
 * @method     ChildPurchaseOrder findOneByFilename(string $filename) Return the first ChildPurchaseOrder filtered by the filename column
 * @method     ChildPurchaseOrder findOneByStore(string $store) Return the first ChildPurchaseOrder filtered by the store column
 * @method     ChildPurchaseOrder findOneByIsSync(string $is_sync) Return the first ChildPurchaseOrder filtered by the is_sync column
 * @method     ChildPurchaseOrder findOneByCustomerCode(string $customer_code) Return the first ChildPurchaseOrder filtered by the customer_code column
 * @method     ChildPurchaseOrder findOneByDeliveryDate(string $delivery_date) Return the first ChildPurchaseOrder filtered by the delivery_date column
 * @method     ChildPurchaseOrder findOneByNumber(string $number) Return the first ChildPurchaseOrder filtered by the number column *

 * @method     ChildPurchaseOrder requirePk($key, ConnectionInterface $con = null) Return the ChildPurchaseOrder by primary key and throws \Propel\Runtime\Exception\EntityNotFoundException when not found
 * @method     ChildPurchaseOrder requireOne(ConnectionInterface $con = null) Return the first ChildPurchaseOrder matching the query and throws \Propel\Runtime\Exception\EntityNotFoundException when not found
 *
 * @method     ChildPurchaseOrder requireOneById(int $id) Return the first ChildPurchaseOrder filtered by the id column and throws \Propel\Runtime\Exception\EntityNotFoundException when not found
 * @method     ChildPurchaseOrder requireOneByFilename(string $filename) Return the first ChildPurchaseOrder filtered by the filename column and throws \Propel\Runtime\Exception\EntityNotFoundException when not found
 * @method     ChildPurchaseOrder requireOneByStore(string $store) Return the first ChildPurchaseOrder filtered by the store column and throws \Propel\Runtime\Exception\EntityNotFoundException when not found
 * @method     ChildPurchaseOrder requireOneByIsSync(string $is_sync) Return the first ChildPurchaseOrder filtered by the is_sync column and throws \Propel\Runtime\Exception\EntityNotFoundException when not found
 * @method     ChildPurchaseOrder requireOneByCustomerCode(string $customer_code) Return the first ChildPurchaseOrder filtered by the customer_code column and throws \Propel\Runtime\Exception\EntityNotFoundException when not found
 * @method     ChildPurchaseOrder requireOneByDeliveryDate(string $delivery_date) Return the first ChildPurchaseOrder filtered by the delivery_date column and throws \Propel\Runtime\Exception\EntityNotFoundException when not found
 * @method     ChildPurchaseOrder requireOneByNumber(string $number) Return the first ChildPurchaseOrder filtered by the number column and throws \Propel\Runtime\Exception\EntityNotFoundException when not found
 *
 * @method     ChildPurchaseOrder[]|ObjectCollection find(ConnectionInterface $con = null) Return ChildPurchaseOrder objects based on current ModelCriteria
 * @method     ChildPurchaseOrder[]|ObjectCollection findById(int $id) Return ChildPurchaseOrder objects filtered by the id column
 * @method     ChildPurchaseOrder[]|ObjectCollection findByFilename(string $filename) Return ChildPurchaseOrder objects filtered by the filename column
 * @method     ChildPurchaseOrder[]|ObjectCollection findByStore(string $store) Return ChildPurchaseOrder objects filtered by the store column
 * @method     ChildPurchaseOrder[]|ObjectCollection findByIsSync(string $is_sync) Return ChildPurchaseOrder objects filtered by the is_sync column
 * @method     ChildPurchaseOrder[]|ObjectCollection findByCustomerCode(string $customer_code) Return ChildPurchaseOrder objects filtered by the customer_code column
 * @method     ChildPurchaseOrder[]|ObjectCollection findByDeliveryDate(string $delivery_date) Return ChildPurchaseOrder objects filtered by the delivery_date column
 * @method     ChildPurchaseOrder[]|ObjectCollection findByNumber(string $number) Return ChildPurchaseOrder objects filtered by the number column
 * @method     ChildPurchaseOrder[]|\Propel\Runtime\Util\PropelModelPager paginate($page = 1, $maxPerPage = 10, ConnectionInterface $con = null) Issue a SELECT query based on the current ModelCriteria and uses a page and a maximum number of results per page to compute an offset and a limit
 *
 */
abstract class PurchaseOrderQuery extends ModelCriteria
{
    protected $entityNotFoundExceptionClass = '\\Propel\\Runtime\\Exception\\EntityNotFoundException';

    /**
     * Initializes internal state of \Base\PurchaseOrderQuery object.
     *
     * @param     string $dbName The database name
     * @param     string $modelName The phpName of a model, e.g. 'Book'
     * @param     string $modelAlias The alias for the model in this query, e.g. 'b'
     */
    public function __construct($dbName = 'default', $modelName = '\\PurchaseOrder', $modelAlias = null)
    {
        parent::__construct($dbName, $modelName, $modelAlias);
    }

    /**
     * Returns a new ChildPurchaseOrderQuery object.
     *
     * @param     string $modelAlias The alias of a model in the query
     * @param     Criteria $criteria Optional Criteria to build the query from
     *
     * @return ChildPurchaseOrderQuery
     */
    public static function create($modelAlias = null, Criteria $criteria = null)
    {
        if ($criteria instanceof ChildPurchaseOrderQuery) {
            return $criteria;
        }
        $query = new ChildPurchaseOrderQuery();
        if (null !== $modelAlias) {
            $query->setModelAlias($modelAlias);
        }
        if ($criteria instanceof Criteria) {
            $query->mergeWith($criteria);
        }

        return $query;
    }

    /**
     * Find object by primary key.
     * Propel uses the instance pool to skip the database if the object exists.
     * Go fast if the query is untouched.
     *
     * <code>
     * $obj  = $c->findPk(12, $con);
     * </code>
     *
     * @param mixed $key Primary key to use for the query
     * @param ConnectionInterface $con an optional connection object
     *
     * @return ChildPurchaseOrder|array|mixed the result, formatted by the current formatter
     */
    public function findPk($key, ConnectionInterface $con = null)
    {
        if ($key === null) {
            return null;
        }
        if ((null !== ($obj = PurchaseOrderTableMap::getInstanceFromPool((string) $key))) && !$this->formatter) {
            // the object is already in the instance pool
            return $obj;
        }
        if ($con === null) {
            $con = Propel::getServiceContainer()->getReadConnection(PurchaseOrderTableMap::DATABASE_NAME);
        }
        $this->basePreSelect($con);
        if ($this->formatter || $this->modelAlias || $this->with || $this->select
         || $this->selectColumns || $this->asColumns || $this->selectModifiers
         || $this->map || $this->having || $this->joins) {
            return $this->findPkComplex($key, $con);
        } else {
            return $this->findPkSimple($key, $con);
        }
    }

    /**
     * Find object by primary key using raw SQL to go fast.
     * Bypass doSelect() and the object formatter by using generated code.
     *
     * @param     mixed $key Primary key to use for the query
     * @param     ConnectionInterface $con A connection object
     *
     * @throws \Propel\Runtime\Exception\PropelException
     *
     * @return ChildPurchaseOrder A model object, or null if the key is not found
     */
    protected function findPkSimple($key, ConnectionInterface $con)
    {
        $sql = 'SELECT id, filename, store, is_sync, customer_code, delivery_date, number FROM purchase_order WHERE id = :p0';
        try {
            $stmt = $con->prepare($sql);
            $stmt->bindValue(':p0', $key, PDO::PARAM_INT);
            $stmt->execute();
        } catch (Exception $e) {
            Propel::log($e->getMessage(), Propel::LOG_ERR);
            throw new PropelException(sprintf('Unable to execute SELECT statement [%s]', $sql), 0, $e);
        }
        $obj = null;
        if ($row = $stmt->fetch(\PDO::FETCH_NUM)) {
            /** @var ChildPurchaseOrder $obj */
            $obj = new ChildPurchaseOrder();
            $obj->hydrate($row);
            PurchaseOrderTableMap::addInstanceToPool($obj, (string) $key);
        }
        $stmt->closeCursor();

        return $obj;
    }

    /**
     * Find object by primary key.
     *
     * @param     mixed $key Primary key to use for the query
     * @param     ConnectionInterface $con A connection object
     *
     * @return ChildPurchaseOrder|array|mixed the result, formatted by the current formatter
     */
    protected function findPkComplex($key, ConnectionInterface $con)
    {
        // As the query uses a PK condition, no limit(1) is necessary.
        $criteria = $this->isKeepQuery() ? clone $this : $this;
        $dataFetcher = $criteria
            ->filterByPrimaryKey($key)
            ->doSelect($con);

        return $criteria->getFormatter()->init($criteria)->formatOne($dataFetcher);
    }

    /**
     * Find objects by primary key
     * <code>
     * $objs = $c->findPks(array(12, 56, 832), $con);
     * </code>
     * @param     array $keys Primary keys to use for the query
     * @param     ConnectionInterface $con an optional connection object
     *
     * @return ObjectCollection|array|mixed the list of results, formatted by the current formatter
     */
    public function findPks($keys, ConnectionInterface $con = null)
    {
        if (null === $con) {
            $con = Propel::getServiceContainer()->getReadConnection($this->getDbName());
        }
        $this->basePreSelect($con);
        $criteria = $this->isKeepQuery() ? clone $this : $this;
        $dataFetcher = $criteria
            ->filterByPrimaryKeys($keys)
            ->doSelect($con);

        return $criteria->getFormatter()->init($criteria)->format($dataFetcher);
    }

    /**
     * Filter the query by primary key
     *
     * @param     mixed $key Primary key to use for the query
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function filterByPrimaryKey($key)
    {

        return $this->addUsingAlias(PurchaseOrderTableMap::COL_ID, $key, Criteria::EQUAL);
    }

    /**
     * Filter the query by a list of primary keys
     *
     * @param     array $keys The list of primary key to use for the query
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function filterByPrimaryKeys($keys)
    {

        return $this->addUsingAlias(PurchaseOrderTableMap::COL_ID, $keys, Criteria::IN);
    }

    /**
     * Filter the query on the id column
     *
     * Example usage:
     * <code>
     * $query->filterById(1234); // WHERE id = 1234
     * $query->filterById(array(12, 34)); // WHERE id IN (12, 34)
     * $query->filterById(array('min' => 12)); // WHERE id > 12
     * </code>
     *
     * @param     mixed $id The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function filterById($id = null, $comparison = null)
    {
        if (is_array($id)) {
            $useMinMax = false;
            if (isset($id['min'])) {
                $this->addUsingAlias(PurchaseOrderTableMap::COL_ID, $id['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($id['max'])) {
                $this->addUsingAlias(PurchaseOrderTableMap::COL_ID, $id['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(PurchaseOrderTableMap::COL_ID, $id, $comparison);
    }

    /**
     * Filter the query on the filename column
     *
     * Example usage:
     * <code>
     * $query->filterByFilename('fooValue');   // WHERE filename = 'fooValue'
     * $query->filterByFilename('%fooValue%'); // WHERE filename LIKE '%fooValue%'
     * </code>
     *
     * @param     string $filename The value to use as filter.
     *              Accepts wildcards (* and % trigger a LIKE)
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function filterByFilename($filename = null, $comparison = null)
    {
        if (null === $comparison) {
            if (is_array($filename)) {
                $comparison = Criteria::IN;
            } elseif (preg_match('/[\%\*]/', $filename)) {
                $filename = str_replace('*', '%', $filename);
                $comparison = Criteria::LIKE;
            }
        }

        return $this->addUsingAlias(PurchaseOrderTableMap::COL_FILENAME, $filename, $comparison);
    }

    /**
     * Filter the query on the store column
     *
     * Example usage:
     * <code>
     * $query->filterByStore('fooValue');   // WHERE store = 'fooValue'
     * $query->filterByStore('%fooValue%'); // WHERE store LIKE '%fooValue%'
     * </code>
     *
     * @param     string $store The value to use as filter.
     *              Accepts wildcards (* and % trigger a LIKE)
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function filterByStore($store = null, $comparison = null)
    {
        if (null === $comparison) {
            if (is_array($store)) {
                $comparison = Criteria::IN;
            } elseif (preg_match('/[\%\*]/', $store)) {
                $store = str_replace('*', '%', $store);
                $comparison = Criteria::LIKE;
            }
        }

        return $this->addUsingAlias(PurchaseOrderTableMap::COL_STORE, $store, $comparison);
    }

    /**
     * Filter the query on the is_sync column
     *
     * Example usage:
     * <code>
     * $query->filterByIsSync('fooValue');   // WHERE is_sync = 'fooValue'
     * $query->filterByIsSync('%fooValue%'); // WHERE is_sync LIKE '%fooValue%'
     * </code>
     *
     * @param     string $isSync The value to use as filter.
     *              Accepts wildcards (* and % trigger a LIKE)
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function filterByIsSync($isSync = null, $comparison = null)
    {
        if (null === $comparison) {
            if (is_array($isSync)) {
                $comparison = Criteria::IN;
            } elseif (preg_match('/[\%\*]/', $isSync)) {
                $isSync = str_replace('*', '%', $isSync);
                $comparison = Criteria::LIKE;
            }
        }

        return $this->addUsingAlias(PurchaseOrderTableMap::COL_IS_SYNC, $isSync, $comparison);
    }

    /**
     * Filter the query on the customer_code column
     *
     * Example usage:
     * <code>
     * $query->filterByCustomerCode('fooValue');   // WHERE customer_code = 'fooValue'
     * $query->filterByCustomerCode('%fooValue%'); // WHERE customer_code LIKE '%fooValue%'
     * </code>
     *
     * @param     string $customerCode The value to use as filter.
     *              Accepts wildcards (* and % trigger a LIKE)
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function filterByCustomerCode($customerCode = null, $comparison = null)
    {
        if (null === $comparison) {
            if (is_array($customerCode)) {
                $comparison = Criteria::IN;
            } elseif (preg_match('/[\%\*]/', $customerCode)) {
                $customerCode = str_replace('*', '%', $customerCode);
                $comparison = Criteria::LIKE;
            }
        }

        return $this->addUsingAlias(PurchaseOrderTableMap::COL_CUSTOMER_CODE, $customerCode, $comparison);
    }

    /**
     * Filter the query on the delivery_date column
     *
     * Example usage:
     * <code>
     * $query->filterByDeliveryDate('2011-03-14'); // WHERE delivery_date = '2011-03-14'
     * $query->filterByDeliveryDate('now'); // WHERE delivery_date = '2011-03-14'
     * $query->filterByDeliveryDate(array('max' => 'yesterday')); // WHERE delivery_date > '2011-03-13'
     * </code>
     *
     * @param     mixed $deliveryDate The value to use as filter.
     *              Values can be integers (unix timestamps), DateTime objects, or strings.
     *              Empty strings are treated as NULL.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function filterByDeliveryDate($deliveryDate = null, $comparison = null)
    {
        if (is_array($deliveryDate)) {
            $useMinMax = false;
            if (isset($deliveryDate['min'])) {
                $this->addUsingAlias(PurchaseOrderTableMap::COL_DELIVERY_DATE, $deliveryDate['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($deliveryDate['max'])) {
                $this->addUsingAlias(PurchaseOrderTableMap::COL_DELIVERY_DATE, $deliveryDate['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(PurchaseOrderTableMap::COL_DELIVERY_DATE, $deliveryDate, $comparison);
    }

    /**
     * Filter the query on the number column
     *
     * Example usage:
     * <code>
     * $query->filterByNumber('fooValue');   // WHERE number = 'fooValue'
     * $query->filterByNumber('%fooValue%'); // WHERE number LIKE '%fooValue%'
     * </code>
     *
     * @param     string $number The value to use as filter.
     *              Accepts wildcards (* and % trigger a LIKE)
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function filterByNumber($number = null, $comparison = null)
    {
        if (null === $comparison) {
            if (is_array($number)) {
                $comparison = Criteria::IN;
            } elseif (preg_match('/[\%\*]/', $number)) {
                $number = str_replace('*', '%', $number);
                $comparison = Criteria::LIKE;
            }
        }

        return $this->addUsingAlias(PurchaseOrderTableMap::COL_NUMBER, $number, $comparison);
    }

    /**
     * Exclude object from result
     *
     * @param   ChildPurchaseOrder $purchaseOrder Object to remove from the list of results
     *
     * @return $this|ChildPurchaseOrderQuery The current query, for fluid interface
     */
    public function prune($purchaseOrder = null)
    {
        if ($purchaseOrder) {
            $this->addUsingAlias(PurchaseOrderTableMap::COL_ID, $purchaseOrder->getId(), Criteria::NOT_EQUAL);
        }

        return $this;
    }

    /**
     * Deletes all rows from the purchase_order table.
     *
     * @param ConnectionInterface $con the connection to use
     * @return int The number of affected rows (if supported by underlying database driver).
     */
    public function doDeleteAll(ConnectionInterface $con = null)
    {
        if (null === $con) {
            $con = Propel::getServiceContainer()->getWriteConnection(PurchaseOrderTableMap::DATABASE_NAME);
        }

        // use transaction because $criteria could contain info
        // for more than one table or we could emulating ON DELETE CASCADE, etc.
        return $con->transaction(function () use ($con) {
            $affectedRows = 0; // initialize var to track total num of affected rows
            $affectedRows += parent::doDeleteAll($con);
            // Because this db requires some delete cascade/set null emulation, we have to
            // clear the cached instance *after* the emulation has happened (since
            // instances get re-added by the select statement contained therein).
            PurchaseOrderTableMap::clearInstancePool();
            PurchaseOrderTableMap::clearRelatedInstancePool();

            return $affectedRows;
        });
    }

    /**
     * Performs a DELETE on the database based on the current ModelCriteria
     *
     * @param ConnectionInterface $con the connection to use
     * @return int             The number of affected rows (if supported by underlying database driver).  This includes CASCADE-related rows
     *                         if supported by native driver or if emulated using Propel.
     * @throws PropelException Any exceptions caught during processing will be
     *                         rethrown wrapped into a PropelException.
     */
    public function delete(ConnectionInterface $con = null)
    {
        if (null === $con) {
            $con = Propel::getServiceContainer()->getWriteConnection(PurchaseOrderTableMap::DATABASE_NAME);
        }

        $criteria = $this;

        // Set the correct dbName
        $criteria->setDbName(PurchaseOrderTableMap::DATABASE_NAME);

        // use transaction because $criteria could contain info
        // for more than one table or we could emulating ON DELETE CASCADE, etc.
        return $con->transaction(function () use ($con, $criteria) {
            $affectedRows = 0; // initialize var to track total num of affected rows

            PurchaseOrderTableMap::removeInstanceFromPool($criteria);

            $affectedRows += ModelCriteria::delete($con);
            PurchaseOrderTableMap::clearRelatedInstancePool();

            return $affectedRows;
        });
    }

} // PurchaseOrderQuery
