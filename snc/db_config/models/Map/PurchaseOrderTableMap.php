<?php

namespace Map;

use \PurchaseOrder;
use \PurchaseOrderQuery;
use Propel\Runtime\Propel;
use Propel\Runtime\ActiveQuery\Criteria;
use Propel\Runtime\ActiveQuery\InstancePoolTrait;
use Propel\Runtime\Connection\ConnectionInterface;
use Propel\Runtime\DataFetcher\DataFetcherInterface;
use Propel\Runtime\Exception\PropelException;
use Propel\Runtime\Map\RelationMap;
use Propel\Runtime\Map\TableMap;
use Propel\Runtime\Map\TableMapTrait;


/**
 * This class defines the structure of the 'purchase_order' table.
 *
 *
 *
 * This map class is used by Propel to do runtime db structure discovery.
 * For example, the createSelectSql() method checks the type of a given column used in an
 * ORDER BY clause to know whether it needs to apply SQL to make the ORDER BY case-insensitive
 * (i.e. if it's a text column type).
 *
 */
class PurchaseOrderTableMap extends TableMap
{
    use InstancePoolTrait;
    use TableMapTrait;

    /**
     * The (dot-path) name of this class
     */
    const CLASS_NAME = '.Map.PurchaseOrderTableMap';

    /**
     * The default database name for this class
     */
    const DATABASE_NAME = 'default';

    /**
     * The table name for this class
     */
    const TABLE_NAME = 'purchase_order';

    /**
     * The related Propel class for this table
     */
    const OM_CLASS = '\\PurchaseOrder';

    /**
     * A class that can be returned by this tableMap
     */
    const CLASS_DEFAULT = 'PurchaseOrder';

    /**
     * The total number of columns
     */
    const NUM_COLUMNS = 8;

    /**
     * The number of lazy-loaded columns
     */
    const NUM_LAZY_LOAD_COLUMNS = 0;

    /**
     * The number of columns to hydrate (NUM_COLUMNS - NUM_LAZY_LOAD_COLUMNS)
     */
    const NUM_HYDRATE_COLUMNS = 8;

    /**
     * the column name for the id field
     */
    const COL_ID = 'purchase_order.id';

    /**
     * the column name for the filename field
     */
    const COL_FILENAME = 'purchase_order.filename';

    /**
     * the column name for the store field
     */
    const COL_STORE = 'purchase_order.store';

    /**
     * the column name for the is_sync field
     */
    const COL_IS_SYNC = 'purchase_order.is_sync';

    /**
     * the column name for the customer_code field
     */
    const COL_CUSTOMER_CODE = 'purchase_order.customer_code';

    /**
     * the column name for the date_created field
     */
    const COL_DATE_CREATED = 'purchase_order.date_created';

    /**
     * the column name for the delivery_date field
     */
    const COL_DELIVERY_DATE = 'purchase_order.delivery_date';

    /**
     * the column name for the number field
     */
    const COL_NUMBER = 'purchase_order.number';

    /**
     * The default string format for model objects of the related table
     */
    const DEFAULT_STRING_FORMAT = 'YAML';

    /**
     * holds an array of fieldnames
     *
     * first dimension keys are the type constants
     * e.g. self::$fieldNames[self::TYPE_PHPNAME][0] = 'Id'
     */
    protected static $fieldNames = array (
        self::TYPE_PHPNAME       => array('Id', 'Filename', 'Store', 'IsSync', 'CustomerCode', 'DateCreated', 'DeliveryDate', 'Number', ),
        self::TYPE_CAMELNAME     => array('id', 'filename', 'store', 'isSync', 'customerCode', 'dateCreated', 'deliveryDate', 'number', ),
        self::TYPE_COLNAME       => array(PurchaseOrderTableMap::COL_ID, PurchaseOrderTableMap::COL_FILENAME, PurchaseOrderTableMap::COL_STORE, PurchaseOrderTableMap::COL_IS_SYNC, PurchaseOrderTableMap::COL_CUSTOMER_CODE, PurchaseOrderTableMap::COL_DATE_CREATED, PurchaseOrderTableMap::COL_DELIVERY_DATE, PurchaseOrderTableMap::COL_NUMBER, ),
        self::TYPE_FIELDNAME     => array('id', 'filename', 'store', 'is_sync', 'customer_code', 'date_created', 'delivery_date', 'number', ),
        self::TYPE_NUM           => array(0, 1, 2, 3, 4, 5, 6, 7, )
    );

    /**
     * holds an array of keys for quick access to the fieldnames array
     *
     * first dimension keys are the type constants
     * e.g. self::$fieldKeys[self::TYPE_PHPNAME]['Id'] = 0
     */
    protected static $fieldKeys = array (
        self::TYPE_PHPNAME       => array('Id' => 0, 'Filename' => 1, 'Store' => 2, 'IsSync' => 3, 'CustomerCode' => 4, 'DateCreated' => 5, 'DeliveryDate' => 6, 'Number' => 7, ),
        self::TYPE_CAMELNAME     => array('id' => 0, 'filename' => 1, 'store' => 2, 'isSync' => 3, 'customerCode' => 4, 'dateCreated' => 5, 'deliveryDate' => 6, 'number' => 7, ),
        self::TYPE_COLNAME       => array(PurchaseOrderTableMap::COL_ID => 0, PurchaseOrderTableMap::COL_FILENAME => 1, PurchaseOrderTableMap::COL_STORE => 2, PurchaseOrderTableMap::COL_IS_SYNC => 3, PurchaseOrderTableMap::COL_CUSTOMER_CODE => 4, PurchaseOrderTableMap::COL_DATE_CREATED => 5, PurchaseOrderTableMap::COL_DELIVERY_DATE => 6, PurchaseOrderTableMap::COL_NUMBER => 7, ),
        self::TYPE_FIELDNAME     => array('id' => 0, 'filename' => 1, 'store' => 2, 'is_sync' => 3, 'customer_code' => 4, 'date_created' => 5, 'delivery_date' => 6, 'number' => 7, ),
        self::TYPE_NUM           => array(0, 1, 2, 3, 4, 5, 6, 7, )
    );

    /**
     * Initialize the table attributes and columns
     * Relations are not initialized by this method since they are lazy loaded
     *
     * @return void
     * @throws PropelException
     */
    public function initialize()
    {
        // attributes
        $this->setName('purchase_order');
        $this->setPhpName('PurchaseOrder');
        $this->setIdentifierQuoting(false);
        $this->setClassName('\\PurchaseOrder');
        $this->setPackage('');
        $this->setUseIdGenerator(false);
        // columns
        $this->addPrimaryKey('id', 'Id', 'INTEGER', true, null, null);
        $this->addColumn('filename', 'Filename', 'VARCHAR', false, 255, null);
        $this->addColumn('store', 'Store', 'VARCHAR', false, 255, null);
        $this->addColumn('is_sync', 'IsSync', 'VARCHAR', false, 255, '0');
        $this->addColumn('customer_code', 'CustomerCode', 'VARCHAR', false, 255, null);
        $this->addColumn('date_created', 'DateCreated', 'DATE', false, null, null);
        $this->addColumn('delivery_date', 'DeliveryDate', 'DATE', false, null, null);
        $this->addColumn('number', 'Number', 'VARCHAR', true, 255, null);
    } // initialize()

    /**
     * Build the RelationMap objects for this table relationships
     */
    public function buildRelations()
    {
    } // buildRelations()

    /**
     * Retrieves a string version of the primary key from the DB resultset row that can be used to uniquely identify a row in this table.
     *
     * For tables with a single-column primary key, that simple pkey value will be returned.  For tables with
     * a multi-column primary key, a serialize()d version of the primary key will be returned.
     *
     * @param array  $row       resultset row.
     * @param int    $offset    The 0-based offset for reading from the resultset row.
     * @param string $indexType One of the class type constants TableMap::TYPE_PHPNAME, TableMap::TYPE_CAMELNAME
     *                           TableMap::TYPE_COLNAME, TableMap::TYPE_FIELDNAME, TableMap::TYPE_NUM
     *
     * @return string The primary key hash of the row
     */
    public static function getPrimaryKeyHashFromRow($row, $offset = 0, $indexType = TableMap::TYPE_NUM)
    {
        // If the PK cannot be derived from the row, return NULL.
        if ($row[TableMap::TYPE_NUM == $indexType ? 0 + $offset : static::translateFieldName('Id', TableMap::TYPE_PHPNAME, $indexType)] === null) {
            return null;
        }

        return (string) $row[TableMap::TYPE_NUM == $indexType ? 0 + $offset : static::translateFieldName('Id', TableMap::TYPE_PHPNAME, $indexType)];
    }

    /**
     * Retrieves the primary key from the DB resultset row
     * For tables with a single-column primary key, that simple pkey value will be returned.  For tables with
     * a multi-column primary key, an array of the primary key columns will be returned.
     *
     * @param array  $row       resultset row.
     * @param int    $offset    The 0-based offset for reading from the resultset row.
     * @param string $indexType One of the class type constants TableMap::TYPE_PHPNAME, TableMap::TYPE_CAMELNAME
     *                           TableMap::TYPE_COLNAME, TableMap::TYPE_FIELDNAME, TableMap::TYPE_NUM
     *
     * @return mixed The primary key of the row
     */
    public static function getPrimaryKeyFromRow($row, $offset = 0, $indexType = TableMap::TYPE_NUM)
    {
        return (int) $row[
            $indexType == TableMap::TYPE_NUM
                ? 0 + $offset
                : self::translateFieldName('Id', TableMap::TYPE_PHPNAME, $indexType)
        ];
    }

    /**
     * The class that the tableMap will make instances of.
     *
     * If $withPrefix is true, the returned path
     * uses a dot-path notation which is translated into a path
     * relative to a location on the PHP include_path.
     * (e.g. path.to.MyClass -> 'path/to/MyClass.php')
     *
     * @param boolean $withPrefix Whether or not to return the path with the class name
     * @return string path.to.ClassName
     */
    public static function getOMClass($withPrefix = true)
    {
        return $withPrefix ? PurchaseOrderTableMap::CLASS_DEFAULT : PurchaseOrderTableMap::OM_CLASS;
    }

    /**
     * Populates an object of the default type or an object that inherit from the default.
     *
     * @param array  $row       row returned by DataFetcher->fetch().
     * @param int    $offset    The 0-based offset for reading from the resultset row.
     * @param string $indexType The index type of $row. Mostly DataFetcher->getIndexType().
                                 One of the class type constants TableMap::TYPE_PHPNAME, TableMap::TYPE_CAMELNAME
     *                           TableMap::TYPE_COLNAME, TableMap::TYPE_FIELDNAME, TableMap::TYPE_NUM.
     *
     * @throws PropelException Any exceptions caught during processing will be
     *                         rethrown wrapped into a PropelException.
     * @return array           (PurchaseOrder object, last column rank)
     */
    public static function populateObject($row, $offset = 0, $indexType = TableMap::TYPE_NUM)
    {
        $key = PurchaseOrderTableMap::getPrimaryKeyHashFromRow($row, $offset, $indexType);
        if (null !== ($obj = PurchaseOrderTableMap::getInstanceFromPool($key))) {
            // We no longer rehydrate the object, since this can cause data loss.
            // See http://www.propelorm.org/ticket/509
            // $obj->hydrate($row, $offset, true); // rehydrate
            $col = $offset + PurchaseOrderTableMap::NUM_HYDRATE_COLUMNS;
        } else {
            $cls = PurchaseOrderTableMap::OM_CLASS;
            /** @var PurchaseOrder $obj */
            $obj = new $cls();
            $col = $obj->hydrate($row, $offset, false, $indexType);
            PurchaseOrderTableMap::addInstanceToPool($obj, $key);
        }

        return array($obj, $col);
    }

    /**
     * The returned array will contain objects of the default type or
     * objects that inherit from the default.
     *
     * @param DataFetcherInterface $dataFetcher
     * @return array
     * @throws PropelException Any exceptions caught during processing will be
     *                         rethrown wrapped into a PropelException.
     */
    public static function populateObjects(DataFetcherInterface $dataFetcher)
    {
        $results = array();

        // set the class once to avoid overhead in the loop
        $cls = static::getOMClass(false);
        // populate the object(s)
        while ($row = $dataFetcher->fetch()) {
            $key = PurchaseOrderTableMap::getPrimaryKeyHashFromRow($row, 0, $dataFetcher->getIndexType());
            if (null !== ($obj = PurchaseOrderTableMap::getInstanceFromPool($key))) {
                // We no longer rehydrate the object, since this can cause data loss.
                // See http://www.propelorm.org/ticket/509
                // $obj->hydrate($row, 0, true); // rehydrate
                $results[] = $obj;
            } else {
                /** @var PurchaseOrder $obj */
                $obj = new $cls();
                $obj->hydrate($row);
                $results[] = $obj;
                PurchaseOrderTableMap::addInstanceToPool($obj, $key);
            } // if key exists
        }

        return $results;
    }
    /**
     * Add all the columns needed to create a new object.
     *
     * Note: any columns that were marked with lazyLoad="true" in the
     * XML schema will not be added to the select list and only loaded
     * on demand.
     *
     * @param Criteria $criteria object containing the columns to add.
     * @param string   $alias    optional table alias
     * @throws PropelException Any exceptions caught during processing will be
     *                         rethrown wrapped into a PropelException.
     */
    public static function addSelectColumns(Criteria $criteria, $alias = null)
    {
        if (null === $alias) {
            $criteria->addSelectColumn(PurchaseOrderTableMap::COL_ID);
            $criteria->addSelectColumn(PurchaseOrderTableMap::COL_FILENAME);
            $criteria->addSelectColumn(PurchaseOrderTableMap::COL_STORE);
            $criteria->addSelectColumn(PurchaseOrderTableMap::COL_IS_SYNC);
            $criteria->addSelectColumn(PurchaseOrderTableMap::COL_CUSTOMER_CODE);
            $criteria->addSelectColumn(PurchaseOrderTableMap::COL_DATE_CREATED);
            $criteria->addSelectColumn(PurchaseOrderTableMap::COL_DELIVERY_DATE);
            $criteria->addSelectColumn(PurchaseOrderTableMap::COL_NUMBER);
        } else {
            $criteria->addSelectColumn($alias . '.id');
            $criteria->addSelectColumn($alias . '.filename');
            $criteria->addSelectColumn($alias . '.store');
            $criteria->addSelectColumn($alias . '.is_sync');
            $criteria->addSelectColumn($alias . '.customer_code');
            $criteria->addSelectColumn($alias . '.date_created');
            $criteria->addSelectColumn($alias . '.delivery_date');
            $criteria->addSelectColumn($alias . '.number');
        }
    }

    /**
     * Returns the TableMap related to this object.
     * This method is not needed for general use but a specific application could have a need.
     * @return TableMap
     * @throws PropelException Any exceptions caught during processing will be
     *                         rethrown wrapped into a PropelException.
     */
    public static function getTableMap()
    {
        return Propel::getServiceContainer()->getDatabaseMap(PurchaseOrderTableMap::DATABASE_NAME)->getTable(PurchaseOrderTableMap::TABLE_NAME);
    }

    /**
     * Add a TableMap instance to the database for this tableMap class.
     */
    public static function buildTableMap()
    {
        $dbMap = Propel::getServiceContainer()->getDatabaseMap(PurchaseOrderTableMap::DATABASE_NAME);
        if (!$dbMap->hasTable(PurchaseOrderTableMap::TABLE_NAME)) {
            $dbMap->addTableObject(new PurchaseOrderTableMap());
        }
    }

    /**
     * Performs a DELETE on the database, given a PurchaseOrder or Criteria object OR a primary key value.
     *
     * @param mixed               $values Criteria or PurchaseOrder object or primary key or array of primary keys
     *              which is used to create the DELETE statement
     * @param  ConnectionInterface $con the connection to use
     * @return int             The number of affected rows (if supported by underlying database driver).  This includes CASCADE-related rows
     *                         if supported by native driver or if emulated using Propel.
     * @throws PropelException Any exceptions caught during processing will be
     *                         rethrown wrapped into a PropelException.
     */
     public static function doDelete($values, ConnectionInterface $con = null)
     {
        if (null === $con) {
            $con = Propel::getServiceContainer()->getWriteConnection(PurchaseOrderTableMap::DATABASE_NAME);
        }

        if ($values instanceof Criteria) {
            // rename for clarity
            $criteria = $values;
        } elseif ($values instanceof \PurchaseOrder) { // it's a model object
            // create criteria based on pk values
            $criteria = $values->buildPkeyCriteria();
        } else { // it's a primary key, or an array of pks
            $criteria = new Criteria(PurchaseOrderTableMap::DATABASE_NAME);
            $criteria->add(PurchaseOrderTableMap::COL_ID, (array) $values, Criteria::IN);
        }

        $query = PurchaseOrderQuery::create()->mergeWith($criteria);

        if ($values instanceof Criteria) {
            PurchaseOrderTableMap::clearInstancePool();
        } elseif (!is_object($values)) { // it's a primary key, or an array of pks
            foreach ((array) $values as $singleval) {
                PurchaseOrderTableMap::removeInstanceFromPool($singleval);
            }
        }

        return $query->delete($con);
    }

    /**
     * Deletes all rows from the purchase_order table.
     *
     * @param ConnectionInterface $con the connection to use
     * @return int The number of affected rows (if supported by underlying database driver).
     */
    public static function doDeleteAll(ConnectionInterface $con = null)
    {
        return PurchaseOrderQuery::create()->doDeleteAll($con);
    }

    /**
     * Performs an INSERT on the database, given a PurchaseOrder or Criteria object.
     *
     * @param mixed               $criteria Criteria or PurchaseOrder object containing data that is used to create the INSERT statement.
     * @param ConnectionInterface $con the ConnectionInterface connection to use
     * @return mixed           The new primary key.
     * @throws PropelException Any exceptions caught during processing will be
     *                         rethrown wrapped into a PropelException.
     */
    public static function doInsert($criteria, ConnectionInterface $con = null)
    {
        if (null === $con) {
            $con = Propel::getServiceContainer()->getWriteConnection(PurchaseOrderTableMap::DATABASE_NAME);
        }

        if ($criteria instanceof Criteria) {
            $criteria = clone $criteria; // rename for clarity
        } else {
            $criteria = $criteria->buildCriteria(); // build Criteria from PurchaseOrder object
        }


        // Set the correct dbName
        $query = PurchaseOrderQuery::create()->mergeWith($criteria);

        // use transaction because $criteria could contain info
        // for more than one table (I guess, conceivably)
        return $con->transaction(function () use ($con, $query) {
            return $query->doInsert($con);
        });
    }

} // PurchaseOrderTableMap
// This is the static code needed to register the TableMap for this table with the main Propel class.
//
PurchaseOrderTableMap::buildTableMap();
