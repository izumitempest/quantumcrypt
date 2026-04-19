# CSC303: Intro to Machine Learning and Predictive Systems
## Godfrey Okoye University - Exam Prep Notes

These notes contain explanations and solutions for two separate quizzes from the course.

---

## Quiz 1 (November 2025)

### 1. Concept Distinctions

#### a. Supervised vs. Unsupervised Machine Learning
*   **Supervised Learning:** The model is trained on a **labeled dataset**, meaning the input data is already tagged with the correct answer (target). It learns to map inputs to outputs based on known examples.
*   **Unsupervised Learning:** The model works with **unlabeled data**. It attempts to find hidden patterns, structures, or groupings (clusters) within the data without being told what the output should be.

#### b. Regression-based vs. Classification-based Supervised Learning
*   **Classification:** Used when the output variable is a **category or discrete label** (e.g., "Yes" or "No", "Spam" or "Not Spam").
*   **Regression:** Used when the output variable is a **continuous numerical value** (e.g., predicting house prices or temperature).

### 2. Multiple Linear Regression Model
If $W$ is the class (target) attribute and $X, Y, Z$ are the non-class (independent) attributes, the multiple linear regression model is expressed as:

$$W = \beta_0 + \beta_1X + \beta_2Y + \beta_3Z + \epsilon$$

**Where:**
*   $W$: Predicted value (Dependent variable)
*   $\beta_0$: Intercept (Constant)
*   $\beta_1, \beta_2, \beta_3$: Coefficients for each attribute
*   $\epsilon$: Error term

---

## Quiz 2 (January 2026)

### 1. Prediction of Nationality
Predicting the nationality of a person (e.g., Nigerian, American, Kenyan) is an example of **Classification** (specifically Multi-class Classification), because nationality is a discrete category.

### 2. Bayes Theory Formula
The formula for conditional probability $P(A|B)$ is:

$$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$$

### 3. Naïve Bayes Classification Problem
**Goal:** Predict "Play?" for the following input:
*   **Weather:** Sunny
*   **Temperature:** Hot
*   **Humidity:** Normal
*   **Wind:** Strong

#### Step 1: Calculate Prior Probabilities
Total records = 10.
*   $P(\text{Yes}) = \frac{5}{10} = 0.5$
*   $P(\text{No}) = \frac{5}{10} = 0.5$

#### Step 2: Calculate Likelihoods (Conditional Probabilities)

| Attribute | Value | $P(\text{Value} \mid \text{Yes})$ | $P(\text{Value} \mid \text{No})$ |
| :--- | :--- | :--- | :--- |
| Weather | Sunny | $1/5 = 0.2$ | $2/5 = 0.4$ |
| Temp | Hot | $2/5 = 0.4$ | $2/5 = 0.4$ |
| Humidity | Normal | $2/5 = 0.4$ | $0/5 = 0.0$ |
| Wind | Strong | $2/5 = 0.4$ | $4/5 = 0.8$ |

#### Step 3: Calculate Posterior Probabilities
Multiply the likelihoods by the prior for each class:

**For "Yes":**
$$P(\text{Yes}) \cdot P(\text{Sunny} \mid \text{Yes}) \cdot P(\text{Hot} \mid \text{Yes}) \cdot P(\text{Normal} \mid \text{Yes}) \cdot P(\text{Strong} \mid \text{Yes})$$
$$0.5 \cdot 0.2 \cdot 0.4 \cdot 0.4 \cdot 0.4 = \mathbf{0.0064}$$

**For "No":**
$$P(\text{No}) \cdot P(\text{Sunny} \mid \text{No}) \cdot P(\text{Hot} \mid \text{No}) \cdot P(\text{Normal} \mid \text{No}) \cdot P(\text{Strong} \mid \text{No})$$
$$0.5 \cdot 0.4 \cdot 0.4 \cdot 0.0 \cdot 0.8 = \mathbf{0.0}$$

### Conclusion
Since $0.0064 > 0.0$, the Naïve Bayes algorithm predicts that **Play = Yes**.

> [!NOTE]
> The "0.0" probability for "No" occurs because "Humidity=Normal" never appeared with "No" in this specific small dataset. In real-world applications, this is typically solved using **Laplace smoothing**.