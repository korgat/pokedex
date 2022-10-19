import { TType } from '../../@types/type';
import typesColor from '../../config/colors';
import DescriptionStat from '../descriptionStat/DescriptionStat';

type TDescriptionTableProps = {
  types: Array<{ slot: number; type: TType }>;
  stats: Array<{ name: string; stat: number }>;
};

function DescriptionTable({ types, stats }: TDescriptionTableProps) {
  const typeNames = types.map((obj) => (
    <div
      key={obj.type.name}
      style={{ backgroundColor: typesColor[obj.type.name] || '#808080' }}
    >
      {obj.type.name}
    </div>
  ));
  const rows = [{ name: 'Type', stat: typeNames }, ...stats];

  return (
    <table className="description__table">
      <tbody>
        {rows.map((obj) => (
          <DescriptionStat key={obj.name} name={obj.name} stat={obj.stat} />
        ))}
      </tbody>
    </table>
  );
}

export default DescriptionTable;
