namespace STUDENTDB;

using {managed} from '@sap/cds/common';


entity STUDENT {
  key ID        : UUID;
      Roll      : String(20);
      Name      : String(100);
      Phone     : String(15);
      IsChecked : Boolean default false;

      remaining : Integer;
}
