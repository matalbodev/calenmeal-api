<?php

namespace App\Repository;

use App\Entity\IngredientInMeal;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<IngredientInMeal>
 *
 * @method IngredientInMeal|null find($id, $lockMode = null, $lockVersion = null)
 * @method IngredientInMeal|null findOneBy(array $criteria, array $orderBy = null)
 * @method IngredientInMeal[]    findAll()
 * @method IngredientInMeal[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IngredientInMealRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, IngredientInMeal::class);
    }

    public function save(IngredientInMeal $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(IngredientInMeal $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return IngredientInMeal[] Returns an array of IngredientInMeal objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('i.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?IngredientInMeal
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
