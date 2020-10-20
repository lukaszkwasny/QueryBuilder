function QueryBuilder() {
    this.select = [];
    this.from = '';
    this.join = [];
    this.where = [];
    this.groupBy = [];
    this.orderBy = [];
    this.groupOpened = false;
    this.having = [];

    this.setFrom = function (from) {
        this.from = from;

        return this;
    }

    this.addJoin = function (type, table, clause) {
        this.join.push(
            type + ' JOIN ' + table + ' ON ' + clause
        );

        return this;
    }

    this.addSelect = function (select) {
        this.select.push(select);

        return this;
    }

    this.addGroupBy = function (groupBy) {
        this.groupBy.push(groupBy);

        return this;
    }

    this.addOrderBy = function (field, type) {
        type = "ASC"
        this.orderBy.push(field + ' ' + type);

        return this;
    }

    this.andWhere = function (field, type, value) {
        this.addWhere('AND', field, type, value);

        return this;
    }

    this.orWhere = function (field, type, value) {
        this.addWhere('OR', field, type, value);

        return this;
    }


    this.andHaving = function (field, type, value) {
        this.addHaving('AND', field, type, value);

        return this;
    }

    this.orHaving = function (field, type, value) {
        this.addHaving('OR', field, type, value);

        return this;
    }

    this.openGroup = function () {
        this.groupOpened = true;

        return this;
    }

    this.closeGroup = function () {
        this.where.push(')');

        return this;
    }

    this.getQuery = function () {
        var sql = [
            "SELECT",
            this.select.join(', '),
            "FROM",
            this.from,
            this.join.join(' '),
            this.where.join(' '),

        ]

        if (this.groupBy.length > 0) {
            sql.push('GROUP BY');
            sql.push(this.groupBy.join(', '))
        }

        if (this.orderBy.length > 0) {
            sql.push('ORDER BY');
            sql.push(this.orderBy.join(', '))
        }

        if (this.having.length > 0) {
            sql.push(this.having.join(''))
        }
        return sql.join(" ");
    }

    //Private
    this.addWhere = function (comparator, field, type, value) {
        if (this.where.length === 0) {
            this.where.push(' WHERE');
            comparator = '';
        }

        if (this.groupOpened) {
            this.where.push(comparator);
            this.where.push('(');
            this.groupOpened = false;
            comparator = '';
        }

        var whereClause = comparator + ' ';

        switch (type) {
            case 'equalInt': {
                whereClause += field + ' = ' + value + '';
            }
            break;
        case 'notEqualInt': {
            whereClause += field + ' != ' + value + '';
        }
        break;
        case 'equalString': {
            whereClause += field + ' = "' + value + '"';
        }
        break;
        case 'notEqualString': {
            whereClause += field + ' != "' + value + '"';
        }
        break;
        case 'greaterInt': {
            whereClause += field + ' > ' + value + ' ';
        }
        break;
        case 'greaterEqualInt': {
            whereClause += field + ' >= ' + value + ' ';
        }
        break;
        case 'less': {
            whereClause += field + " < '" + value + "'";
        }
        break;
        case 'lessEqual': {
            whereClause += field + " <= '" + value + + "'";
        }
        break;
        case 'startWith': {
            whereClause += field + " = '" + value + "'%";
        }
        break;
        case 'endWith': {
            whereClause += field + " = '%" + value + "'";
        }
        break;
        case 'contain': {
            whereClause += field + " LIKE '%" + value + "%'";
        }
        break;
        case 'startAndEnd': {
            whereClause += field + " LIKE '" + value.start + "%" + value.end + "'" ;
        }
        break;
        case 'mostPosition': {
            whereClause += field + " LIKE '" + "_".repeat(value.howMany) + value.word + "%'";
        }
        break;
        case 'leastCharacters': {
            whereClause += field + " LIKE '" + value.word + "_".repeat(value.howMany) + "%'";
        }
        break;
     case 'between': {
            if (value.start !== undefined && value.end !== undefined && value.start !== null && value.end !== null) {
                whereClause += field + " BETWEEN '" + value.start + "' AND '" + value.end + "'";
            } else if (value.start !== undefined && value.start !== null) {
                whereClause += field + " >= '" + value.start + "'";
            } else if (value.end !== undefined && value.start !== null) {
                whereClause += field + " <= '" + value.end + "'";
            }
        }
        }

        this.where.push(whereClause);
    }

    this.addHaving = function (comparator, field, type, value) {
        if (this.having.length === 0) {
            this.having.push(' HAVING');
            comparator = '';
        }

        if (this.groupOpened) {
            this.having.push(comparator);
            this.having.push('(');
            this.groupOpened = false;
            comparator = '';
        }

        var havingClause = comparator + ' ';

        switch (type) {
            case 'equalInt': {
                havingClause += field + ' = ' + value + '';
            }
            break;
        case 'notEqualInt': {
            havingClause += field + ' != ' + value + '';
        }
        break;
        case 'equalString': {
            havingClause += field + ' = "' + value + '"';
        }
        break;
        case 'notEqualString': {
            havingClause += field + ' != "' + value + '"';
        }
        break;
        case 'greaterInt': {
            havingClause += field + ' > ' + value + '';
        }
        break;
        case 'greaterEqualInt': {
            havingClause += field + ' >= ' + value + '';
        }
        break;
        case 'less': {
            havingClause += field + " < '" + value + "'";
        }
        break;
        case 'lessEqual': {
            havingClause += field + " <= '" + value + + "'";
        }
        break;
        case 'startWith': {
            havingClause += field + " = '" + value + "'%";
        }
        break;
        case 'endWith': {
            havingClause += field + " = '%" + value + "'";
        }
        break;
        case 'contain': {
            havingClause += field + " LIKE '%" + value + "%'";
        }
        break;
 	  case 'startAndEnd': {
            havingClause += field + " LIKE '" + value.start + "%" + value.end + "'" ;
        }
        break;
        case 'mostPosition': {
            havingClause += field + " LIKE '" + "_".repeat(value.howMany) + value.word + "%'";
        }
        break;
        case 'leastCharacters': {
            havingClause += field + " LIKE '" + value.word + "_".repeat(value.howMany) + "%'";
        }
        break;    
     case 'between': {
            if (value.start !== undefined && value.end !== undefined && value.start !== null && value.end !== null) {
                havingClause += field + " BETWEEN '" + value.start + "' AND '" + value.end + "'";
            } else if (value.start !== undefined && value.start !== null) {
                havingClause += field + " >= '" + value.start + "'";
            } else if (value.end !== undefined && value.end !== null) {
                havingClause += field + " <= '" + value.end + "'";
            }
        }
       }

        this.having.push(havingClause);
    }
}
 

var query = new QueryBuilder();





query
 .addSelect('b.BATCH_ID') 
 .addSelect('b.PROCESS_ID')
 .addSelect('b.BUKRS')
 .addSelect('b.GJAHR')
 .addSelect('b.GDLGRP')
 .addSelect('b.CREATED')
 .addSelect('b.STATUS')
 .addSelect('b.REVIEWER')
 .addSelect('b.APPROVER')
 .addSelect("Count(bd.BATCH_ID) as 'all'")
 .addSelect("isnull(sum(CAST(bd.TML_ISACCEPTED AS int)),0)")
 .setFrom('dbo.BATCH b')
 .addJoin('LEFT', 'dbo.BATCH_DATA bd', 'b.BATCH_ID = bd.BATCH_ID')
 .addGroupBy('b.BATCH_ID')
 .addGroupBy('b.PROCESS_ID')
 .addGroupBy('b.BUKRS')
 .addGroupBy('b.GJAHR')
 .addGroupBy('b.GDLGRP')
 .addGroupBy('b.CREATED')
 .addGroupBy('b.REVIEWER')
 .addGroupBy('b.APPROVER')
 .addGroupBy('b.STATUS')

 
if (true) {
	query.andWhere('b.PROCESS_ID', 'equal', '250')
}

if (true) {
	query.andWhere('b.APPROVER', 'contain', 'Lukasz')
}

if (true) {
	query.andWhere('b.REVIEWER', 'contain', 'Andrzej')
}

if(true){
 	query.andWhere('b.STATUS', 'equalString', 'COMPLETED')
}

if(true){
 	query.andHaving('Count(bd.BATCH_ID)', 'greaterInt','100')
}

     
if(true){

    query.andWhere('Count(bd.BATCH_ID)', 'greaterInt','100')


}

var button = true;
if(button != false){
    query.andWhere('NETTO', 'between',
    {
     start : '5000',
     end : '10000'
   })
} 


console.log(query.getQuery());