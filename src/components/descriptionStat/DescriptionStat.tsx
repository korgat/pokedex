import colorChecker from '../../helpers/colorChecker';

type TDescriptionStatProps = {
  name: string;
  stat: number | JSX.Element[];
};

function DescriptionStat({ name, stat }: TDescriptionStatProps) {
  return (
    <tr key={name} className="table-row">
      <td className="table-row__description">{name}</td>
      <td
        className="table-row__points"
        style={{
          color: typeof stat === 'number' ? colorChecker(stat) : '#ffffff',
        }}
      >
        {stat}
      </td>
    </tr>
  );
}

export default DescriptionStat;
