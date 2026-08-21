using {STUDENTDB} from '../db/schema';

service studentDataServices {
    entity STUDENT as projection on STUDENTDB.STUDENT;
}
